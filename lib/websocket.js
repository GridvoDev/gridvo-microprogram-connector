'use strict';
const EventEmitter = require('events');

const ST_INITED = 0;
const ST_CLOSED = 1;

class Socket extends EventEmitter {
    constructor(id, socket) {
        super();
        this.id = id;
        this.socket = socket;
        this.remoteAddress = {
            ip: socket._socket.remoteAddress,
            port: socket._socket.remotePort
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
    }

    send(msg) {
        if (this.state !== ST_INITED) {
            return;
        }
        if (typeof msg !== 'string') {
            msg = JSON.stringify(msg);
        }
        this.socket.send(msg);
    }

    sendBatch(msgs) {
        let res = [];
        for (let msg of msgs) {
            if (typeof msg === 'string') {
                res.push(msg);
            } else {
                res.push(JSON.stringify(msg));
            }
        }
        this.send(JSON.stringify(res));
    }

    disconnect() {
        if (this.state === ST_CLOSED) {
            return;
        }
        this.state = ST_CLOSED;
        this.socket.close();
    }
}

module.exports = Socket;