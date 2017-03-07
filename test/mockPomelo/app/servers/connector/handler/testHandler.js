'use strict';

let Handler = function (app) {
    this._app = app;
};

Handler.prototype.testRequest = function (msg, session, next) {
    next(null, msg);
};

Handler.prototype.testPush = function (msg, session, next) {
    session.bind("test-id", () => {
        let channel = this._app.get('channelService').getChannel("test", true);
        channel.add(session.uid, this._app.getServerId());
        let self = this;
        channel.pushMessage("onTest", {test: "test content"}, (err) => {
            console.log("push message");
            channel.leave(session.uid, self._app.getServerId());
        });
    });
    next(null, "push");
};

module.exports = function (app) {
    return new Handler(app);
};
