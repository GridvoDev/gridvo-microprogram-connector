'use strict';
const pomelo = require('pomelo');
const MicroprogramConnector = require('../../lib/websocketConnector');

let app = pomelo.createApp();

app.set('name', 'test-app');

app.configure('production|development', 'connector', () => {
    app.set('connectorConfig',
        {
            connector: MicroprogramConnector
        });
});

app.start((err) => {
    if (err) {
        console.log(err.stack);
    }
    else {
        console.log("test app is start");
    }
});

process.on('uncaughtException', err => {
    console.log(`Caught exception: ${err.stack}`);
});