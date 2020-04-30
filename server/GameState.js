const schema = require('@colyseus/schema');

// import { MapSchema, Schema } from '@colyseus/schema';
// import { Bullet, Game, Message, Monster, Player, Prop } from '../entities';

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

class Player extends schema.Schema {
  constructor(
    playerId,
    name,
    team = "",
    connected = true,
  ) {
    super();
    this.playerId = playerId;
    this.name = name;
    this.team = team;
    this.connected = connected;
    this.ready = false;
    //this.color = team ? getTeamColor(team) : '#FFFFFF';
  }

  setName(name) {
    this.name = name;
  }

  setTeam(team) {
    this.team = team;
  }

}

schema.defineTypes(Player, {
  playerId: "string",
  name: "string",
  team: "string",
  connected: "boolean",
  ready: "boolean",
});
/*
class Message {

  constructor(
    type,
    params,
  ) {
    this.type = type;
    this.ts = Date.now();
    this.params = params;
  }

  get JSON() {
    return {
      type: this.type,
      ts: this.ts,
      params: this.params,
    };
  }
}
*/

class GameState extends schema.Schema {

  // INIT
  constructor(
    sendMessage, maxClients
  ) {
    super();

    this.players = new schema.MapSchema();
    this.actions = [];
    this.gameState = 'lobby'; //, 'game'
    this.countdown = false;
    this.maxClients = maxClients;

    // Game
    /*
    this.game = new Game({
      roomName,
      mapName,
      maxPlayers,
      mode,
      onWaitingStart: this.handleWaitingStart,
      onLobbyStart: this.handleLobbyStart,
      onGameStart: this.handleGameStart,
      onGameEnd: this.handleGameEnd,
    });
*/
    // Callback
    this.sendMessage = sendMessage;
  }

  // UPDATES
  update() {
  }


  // PLAYERS: single
  playerAdd(id, name) {
    const player = new Player(
      id,
      name || id,
    );

    this.players[id] = player;

    // Broadcast message to other players
    this.sendMessage('joined', player.name);
  }
  /*
    playerPushAction(action) {
      this.actions.push(action);
    }
  */
  playerName(id, name) {
    const player = this.players[id];
    if (!player) {
      return;
    }

    player.setName(name);
  }


  playerRemove(id) {
    this.sendMessage('left', this.players[id].name);
    delete this.players[id];
  }

  /*
  
    setPlayersTeamsRandomly() {
      // Add all players' ids into an array
      let playersIds = [];
      for (const playerId in this.players) {
        playersIds.push(playerId);
      }
  
      // Shuffle players' ids
      playersIds = shuffle(playersIds);
  
      const minimumPlayersPerTeam = Math.floor(playersIds.length / 2);
      const rest = playersIds.length % 2;
  
      for (let i = 0; i < playersIds.length; i++) {
        const playerId = playersIds[i];
        const player = this.players[playerId];
        const isBlueTeam = i < (minimumPlayersPerTeam + rest);
  
        player.setTeam(isBlueTeam ? 'Blue' : 'Red');
      }
    }
    */

}

schema.defineTypes(GameState, {
  players: { map: Player },
  gameState: "string",
  countdown: "boolean",
  maxClients: "number",
});

exports.GameState = GameState;