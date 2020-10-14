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
  constructor(id) {
    this.id = id;
    this.state = "LOBBY";
    this.players = {};
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
    } else {
      return false;
    }
  }
}

const liveGames = {};

const doSocket = (http) => {
  const io = require("socket.io")(http);

  io.on("connection", (socket) => {
    console.log(`socket has connected ${socket.id}`);

    socket.on("CREATE_GAME", (data) => {
      const { gameID } = data;
      if (gameID) {
        console.log(`creating game ${gameID}`);
        liveGames[gameID] = new Game(gameID);
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
