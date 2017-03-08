'use strict';
const util = require('util');
const EventEmitter = require('events').EventEmitter;
const https = require('https');
const ws = require('ws');
const WebSocket = require('./websocket');

let curId = 1;
let Connector = function (port, host, opts) {
    if (!(this instanceof Connector)) {
        return new Connector(port, host, opts);
    }
    EventEmitter.call(this);
    this.port = port;
    this.host = host;
    this.opts = opts;
};

Connector.prototype.start = function (cb) {
    let self = this;
    let port = this.port;
    let {ssl}=this.opts;
    if (ssl) {
        let {key, ca, cert} = ssl;
        let httpsServer = https.createServer({key, ca, cert}, (req, res) => {
            res.writeHead(403);
            res.end("This is a WebSockets server!\n");
        }).listen(port);
        this.websocketServer = new ws.Server({server: httpsServer});
    }
    else {
        this.websocketServer = new ws.Server({port});
    }
    this.websocketServer.on('connection', (socket) => {
        let websocket = new WebSocket(curId++, socket);
        self.emit('connection', websocket);
    });
    process.nextTick(cb);
};

Connector.prototype.stop = function (force, cb) {
    this.websocketServer.close();
    process.nextTick(cb);
};

Connector.prototype.encode = function (reqId, route, msg) {
    let websocketBuffer;
    if (reqId) {
        websocketBuffer = composeResponse(reqId, route, msg);
    } else {
        websocketBuffer = composePush(route, msg);
    }
    return websocketBuffer;
};

let composeResponse = (msgId, route, msgBody) => {
    return {
        id: msgId,
        body: msgBody
    };
};

let composePush = (route, msgBody) => {
    return JSON.stringify({
        route: route,
        body: msgBody
    });
};

Connector.prototype.decode = function (websocketBuffer) {
    let {id, route, body} = JSON.parse(websocketBuffer);
    return {
        id,
        route,
        body
    };
};

util.inherits(Connector, EventEmitter);

module.exports = Connector;