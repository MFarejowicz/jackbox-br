const socketThing = require("socket.io");
const Game = require("./game");
const GameState = require("./gameState");

const liveGames = {};

const onDisconnect = (socket, io) => {
  const { gameID } = socket;
  if (gameID) {
    const game = liveGames[gameID];
    if (game) {
      game.removePlayer(socket.id);
      if (game.getPlayerCount() === 0) {
        delete liveGames[gameID];
      }

      delete socket.gameID;
      delete socket.name;
      socket.leave(gameID);

      io.to(gameID).emit("PLAYERS_UPDATE", { players: game.getFormattedPlayers() });
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
          const error = game.addPlayer(socket.id, name, leader);
          if (callback) callback(error); // need to callback first to change to game page
          if (!error) {
            socket.gameID = gameID;
            socket.name = name;
            socket.join(gameID);
            io.to(gameID).emit("PLAYERS_UPDATE", { players: game.getFormattedPlayers() });
          }
        } else {
          if (callback) callback(`No game exists with id ${gameID}!`);
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
          io.to(gameID).emit("GAME_STATE_UPDATE", { newState: game.getState() });
        }
      }
    });

    socket.on("LEAVE_GAME", () => {
      onDisconnect(socket, io);
    });

    socket.on("disconnect", () => {
      console.log(`socket has disconnected ${socket.id}`);
      onDisconnect(socket, io);
    });
  });
};

module.exports = doSocket;
