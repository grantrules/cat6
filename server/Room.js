const colyseus = require('colyseus');
const GameState = require('./GameState');
const nanoid = require('nanoid');

const genId = nanoid.customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);



exports.Room = class extends colyseus.Room {

  onCreate(options) {
    let roomId = genId();
    while (this.presence.hget("rooms", roomId) === "1") {
      roomId = genId();
    }
    this.presence.hset("rooms", roomId, "1");
    this.roomId = roomId;
    this.maxClients = 4;
    this.onMessage("chat", (client, message) => {
      const msg = { from: this.state.players[client.id].name, time: new Date().getTime(), message };
      console.log(`chat from ${msg.from}: ${msg.message}`);
      this.broadcast('chat', msg);
    });
    this.onMessage('heart', (client,message) => {
      console.log(`got heart rate from ${client.id}: ${message} bpm`);
      this.state.playerData[client.id].setHeart(message);
    });
    
    this.onMessage('power', (client,message) => {
      console.log(`got power rate from ${client.id}: ${message} bpm`);
      this.state.playerData[client.id].setPower(message);
    });
    this.onMessage('cadence', (client,message) => {
      console.log(`got heart rate from ${client.id}: ${message} bpm`);
      this.state.playerData[client.id].setCadence(message);
    });

    this.onMessage("ready", (client, message) => {
      this.state.players[client.id].ready = !!message;

      let allReady = true;
      let numPlayers = 0;
      for (let id in this.state.players) {
        const ready = this.state.players[id].ready;
        allReady = allReady && ready;
        numPlayers++;
      }
      if (allReady && numPlayers === this.maxClients) {
        console.log('starting countdown');
        this.state.countdown = true;
        this.countdownTimer = setTimeout(() => this.state.gameState = 'game', 5000);
      }
      if (!allReady && this.countdownTimer) {
        console.log('cancelling countdown');
        clearTimeout(this.countdownTimer);
        this.state.countdown = false;
      }
    });
    this.setState(new GameState.GameState(this.sendMessage.bind(this),this.maxClients || 4));

  }

  sendMessage(type, message) {
    console.log(`${type} ${message}`);
    this.broadcast(type, message);
  }

  onJoin(client, options) {
    console.log(`${options.playerName} joined`);
    this.state.playerAdd(client.sessionId, options.playerName, options.playerWeight);
  }

  async onLeave(client, consented) {
    // flag client as inactive for other users
    this.state.players[client.sessionId].connected = false;

    try {
      if (consented) {
        throw new Error("consented leave");
      }

      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 20);

      // client returned! let's re-activate it.
      this.state.players[client.sessionId].connected = true;

    } catch (e) {
      this.state.playerRemove(client.sessionId);

      // 20 seconds expired. let's remove the client.
      delete this.state.players[client.sessionId];
    }
  }
  onDispose() {
    this.presence.hdel("rooms", this.roomId);
  }

}
