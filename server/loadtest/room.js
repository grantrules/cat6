const names = ['Frank', 'Bill', 'Slappy', 'Adolf', 'Abe', 'John', 'Sissy', 'Gus'];
const lnames = ['Hill', 'Murray', 'Slippy', 'Churchill', 'Lincoln', 'Quincy', 'Spacey', 'Tavo'];

const messages = ["What's crackalackin", "Highdidly-ho neighborino", "sup", "what's good dudes"];

exports.requestJoinOptions = function (i) {
    const name = `${names.sort(() => Math.random() - 0.5)[0]} ${lnames.sort(() => Math.random() - 0.5)[0]}`;
    return { requestNumber: i, playerName: name, playerWeight: 80 };
}

exports.onJoin = function () {
    console.log(this.sessionId, "joined.");
    const msg = messages.sort(() => Math.random() - 0.5)[0];

    setTimeout(() => {
        this.send("chat", msg);
        this.send("ready", true);
    }, 1500);
    this.interval = setInterval(() => this.send('power', Math.round(Math.random() * 800)), 1000);
    this.onMessage('*', (client, message) => {});
}

exports.onMessage = function (message) {
    console.log(this.sessionId, "received:", message);
}

exports.onLeave = function () {
    console.log(this.sessionId, "left.");
    clearInterval(this.interval);
}

exports.onError = function (err) {
    console.log(this.sessionId, "!! ERROR !!", err.message);
}

exports.onStateChange = function (state) {
    console.log(this.sessionId, "new state");
}