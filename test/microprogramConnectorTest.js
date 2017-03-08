'use strict';
const WebSocket = require('ws');
const should = require('should');

describe('microprogramConnector test', () => {
    describe('test  microprogramConnector', () => {
        context('client request', () => {
            let client;
            it('request route can get response', done => {
                client = new WebSocket('wss://127.0.0.1:3011');
                client.on('open', () => {
                    client.send(JSON.stringify({
                        id: "request-test",
                        route: "connector.testHandler.testRequest",
                        body: {
                            test1: 1,
                            test2: 2
                        }
                    }));
                    done();
                });
                client.on('message', (data, flags) => {
                    console.log(data);
                    console.log(flags);
                    let msg = JSON.parse(data);
                    msg.id.should.eql("request-test");
                    msg.body.test1.should.eql(1);
                    msg.body.test2.should.eql(2);
                });
            });
            after(done => {
                client.close();
                done();
            });
        });
        context('server push', () => {
            let client;
            it('can get push response', done => {
                let currentDoneCount = 0;

                function doneMore(err) {
                    currentDoneCount++;
                    if (currentDoneCount == 2) {
                        if (err) {
                            done(err);
                        }
                        else {
                            done();
                        }
                    }
                };
                client = new WebSocket('ws://127.0.0.1:3011');
                client.on('open', () => {
                    client.send(JSON.stringify({
                        id: "push-test",
                        route: "connector.testHandler.testPush",
                        body: {}
                    }));
                });
                client.on('message', (data, flags) => {
                    console.log(data);
                    console.log(flags);
                    doneMore();
                });
            });
            after(done => {
                client.close();
                done();
            });
        });
    });
});