class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  getID() {
    return this.id;
  }

  getName() {
    return this.name;
  }
}

class Game {
  constructor(id, io) {
    this.id = id;
    this.io = io;
    this.state = "LOBBY";
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
    return Object.values(this.players).some((player) => player.name === name);
  }

  getPlayers() {
    return this.players;
  }

  getFormattedPlayers() {
    return Object.values(this.players).map((player) => player.getName());
  }

  getPlayer(id) {
    return this.players[id];
  }

  addPlayer(id, name) {
    if (this.hasPlayer(name)) {
      return "This name is already taken!";
    }

    console.log(`adding player ${id} to game ${this.getID()}`);
    this.players[id] = new Player(id, name);
    return "";
  }

  removePlayer(id) {
    if (this.players[id]) {
      console.log(`removing player ${id} from game ${this.getID()}`);
      delete this.players[id];
      return true;
    }

    return false;
  }
}

module.exports = Game;
