'use strict';
const util = require('util');
const EventEmitter = require('events').EventEmitter;

const ST_INITED = 0;
const ST_CLOSED = 1;

let Socket = function (id, socket) {
    EventEmitter.call(this);
    this.id = id;
    this.socket = socket;
    this.remoteAddress = {
        ip: "127.0.0.1",
        port: "8989"
    };
    let self = this;
    socket.on('close', (code, reason) => {
        self.emit('disconnect');
    });
    socket.on('error', (error) => {
        self.emit('error');
    });
    socket.on('message', (data, flags) => {
        let websocketBuffer = data;
        self.emit('message', websocketBuffer);
    });
    this.state = ST_INITED;
};
util.inherits(Socket, EventEmitter);

Socket.prototype.send = function (msg) {
    if (this.state !== ST_INITED) {
        return;
    }
    if (typeof msg !== 'string') {
        msg = JSON.stringify(msg);
    }
    this.socket.send(msg);
};

Socket.prototype.sendBatch = function (msgs) {
    let res = [];
    for (let msg of msgs) {
        if (typeof msg === 'string') {
            res.push(msg);
        } else {
            res.push(JSON.stringify(msg));
        }
    }
    this.send(JSON.stringify(res));
};

Socket.prototype.disconnect = function () {
    if (this.state === ST_CLOSED) {
        return;
    }
    this.state = ST_CLOSED;
    this.socket.close();
};

module.exports = Socket;