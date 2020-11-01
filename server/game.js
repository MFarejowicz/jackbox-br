const GameState = require("./gameState");

class Player {
  constructor(id, name, leader) {
    this.id = id;
    this.name = name;
    this.leader = leader;
  }

  getID() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getLeadership() {
    return this.leader;
  }

  setLeadership(leader) {
    this.leader = leader;
  }
}

class Game {
  constructor(id, io) {
    this.id = id;
    this.io = io;
    this.state = GameState.LOBBY;
    this.players = {}; // id -> Player
    // this.timer = new Timr(60, { padRaw: false }); // padRaw false => raw returns number
    // this.timer.ticker(({ _formattedTime, _percentDone, raw }) => {
    // console.log(formattedTime);
    // console.log(percentDone);
    // console.log(raw);
    // this.io.to(this.id).emit("COUNTDOWN", { time: raw.currentSeconds });
    // formattedTime: '09:59'
    // percentDone:   0
    // });
    // this.timer.start();
    // this.timerInstance = new Timer({ target: { seconds: 10 }, countdown: true });
    // this.timerInstance.on("secondsUpdated", () => {
    //   console.log("here");
    //   this.io.emit("COUNTDOWN", { time: this.timerInstance.getTimeValues() });
    // });
    // this.timerInstance.start();
    console.log(`creating game ${id}`);
  }

  getID() {
    return this.id;
  }

  getState() {
    return this.state;
  }

  setState(state) {
    this.state = state;
  }

  hasPlayer(name) {
    return Object.values(this.players).some((player) => player.getName() === name);
  }

  getPlayers() {
    return this.players;
  }

  getFormattedPlayers() {
    return Object.values(this.players).map((player) => ({
      name: player.getName(),
      leader: player.getLeadership(),
    }));
  }

  getPlayer(id) {
    return this.players[id];
  }

  getPlayerCount() {
    return Object.keys(this.players).length;
  }

  addPlayer(id, name, leader) {
    if (this.hasPlayer(name)) {
      return "This name is already taken!";
    }

    console.log(`adding player ${id} to game ${this.getID()}`);
    this.players[id] = new Player(id, name, leader);
    return "";
  }

  removePlayer(id) {
    const player = this.players[id];
    if (player) {
      console.log(`removing player ${id} from game ${this.getID()}`);
      delete this.players[id];

      if (player.leader && this.getPlayerCount() > 0) {
        // choose new leader
        const players = Object.values(this.getPlayers());
        const newLeader = players[Math.floor(Math.random() * players.length)];
        newLeader.setLeadership(true);
      }
      return true;
    }

    return false;
  }
}

module.exports = Game;
