export default class Event {
    constructor(sender) {
        this._sender = sender;
        this._listeners = [];
    }
    attach(callback = null) {
        if (callback == null) return;
        this._listeners.push(callback);
    }
    notify(args) {
        this._listeners.map(item => {
            item(this._sender, args);
        })
    }
}