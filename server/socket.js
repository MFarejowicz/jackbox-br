const socketThing = require("socket.io");
const Timr = require("timrjs");

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
    this.players = {};
    this.timer = new Timr(60, { padRaw: false }); // padRaw false => raw returns number
    this.timer.ticker(({ _formattedTime, _percentDone, raw }) => {
      // console.log(formattedTime);
      // console.log(percentDone);
      // console.log(raw);
      this.io.to(this.id).emit("COUNTDOWN", { time: raw.currentSeconds });
      // formattedTime: '09:59'
      // percentDone:   0
    });
    this.timer.start();
    // this.timerInstance = new Timer({ target: { seconds: 10 }, countdown: true });
    // this.timerInstance.on("secondsUpdated", () => {
    //   console.log("here");
    //   this.io.emit("COUNTDOWN", { time: this.timerInstance.getTimeValues() });
    // });
    // this.timerInstance.start();
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

  getPlayers() {
    return this.players;
  }

  getPlayer(id) {
    return this.players[id];
  }

  addPlayer(id, name) {
    console.log(`adding player ${name} to game ${this.getID()}`);
    this.players[id] = new Player(id, name);
  }

  removePlayer(id) {
    if (this.players[id]) {
      delete this.players[id];
      return true;
    }

    return false;
  }
}

const liveGames = {};

const doSocket = (http) => {
  const io = socketThing(http);

  io.on("connection", (socket) => {
    console.log(`socket has connected ${socket.id}`);

    socket.on("CREATE_GAME", (data) => {
      const { gameID } = data;
      if (gameID) {
        console.log(`creating game ${gameID}`);
        liveGames[gameID] = new Game(gameID, io);
      } else {
        console.log("missing game data");
      }
    });

    socket.on("JOIN_GAME", (data) => {
      const { name, gameID } = data;
      if (name && gameID) {
        const game = liveGames[gameID];
        if (game) {
          socket.join(gameID);
          liveGames[gameID].addPlayer(socket.id, name);
        } else {
          console.log(`no game exists with id ${gameID}`);
        }
      } else {
        console.log("missing name or game data");
      }
    });

    socket.on("disconnect", () => {
      console.log(`socket has disconnected ${socket.id}`);
    });
  });
};

module.exports = doSocket;
