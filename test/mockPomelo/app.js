'use strict';
const fs = require('fs');
const pomelo = require('pomelo');
const MicroprogramConnector = require('../../lib/websocketConnector');

let app = pomelo.createApp();

app.set('name', 'test-app');

app.configure('production|development', 'connector', () => {
    app.set('connectorConfig',
        {
            connector: MicroprogramConnector,
            ssl: {
                key: fs.readFileSync(`${__dirname }/keys/gridvocomrsa.key`),
                ca: [fs.readFileSync(`${__dirname }/keys/1_root_bundle.crt`)],
                cert: fs.readFileSync(`${__dirname }/keys/1_www.gridvo.com_bundle.crt`)
            }
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