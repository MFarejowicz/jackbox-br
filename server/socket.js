const socketThing = require("socket.io");
const Game = require("./game");
const GameState = require("./gameState");

const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const liveGames = {};

const onDisconnect = (socket) => {
  const { gameID } = socket;
  if (gameID) {
    const game = liveGames[gameID];
    if (game) {
      game.removePlayer(socket);
      if (game.getPlayerCount() === 0) {
        delete liveGames[gameID];
      }
    }
  }
};

const doSocket = (http) => {
  const io = socketThing(http);

  io.on("connection", (socket) => {
    console.log(`socket has connected ${socket.id}`);

    socket.on("CREATE_GAME", (data) => {
      const { gameID } = data;
      if (gameID) {
        liveGames[gameID] = new Game(gameID, io);
      } else {
        console.log("missing game data");
      }
    });

    socket.on("JOIN_GAME", (data, callback) => {
      const { name, leader, gameID } = data;
      if (name && gameID) {
        const game = liveGames[gameID];
        if (game) {
          game.addPlayer(socket, callback, name, leader);
        } else {
          callback(`No game exists with id ${gameID}!`);
          console.log(`no game exists with id ${gameID}`);
        }
      } else {
        console.log("missing name or game data");
      }
    });

    socket.on("START_GAME", () => {
      const { gameID } = socket;
      if (gameID) {
        const game = liveGames[gameID];
        if (game) {
          game.setState(GameState.PREROUNDONE);

          setTimeout(() => {
            io.to(gameID).emit("TRANSITION_UPDATE", { winIndex: randomIntFromInterval(0, 2) });
          }, 5000);

          setTimeout(() => {
            game.setState(GameState.ROUNDONE);
          }, 5000 + 11850);
        }
      }
    });

    socket.on("LEAVE_GAME", () => {
      onDisconnect(socket);
    });

    socket.on("disconnect", () => {
      console.log(`socket has disconnected ${socket.id}`);
      onDisconnect(socket);
    });
  });
};

module.exports = doSocket;
