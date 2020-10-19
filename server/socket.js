const socketThing = require("socket.io");
const Game = require("./game");

const liveGames = {};

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
      const { name, gameID } = data;
      if (name && gameID) {
        const game = liveGames[gameID];
        if (game) {
          const success = game.addPlayer(socket.id, name);
          if (callback) callback(success); // need to callback first to change to game page
          if (success) {
            socket.join(gameID);
            io.to(gameID).emit("ADD_PLAYER", { players: game.getFormattedPlayers() });
          }
        } else {
          console.log(`no game exists with id ${gameID}`);
        }
      } else {
        console.log("missing name or game data");
      }
    });

    socket.on("LEAVE_GAME", (data) => {
      const { gameID } = data;
      if (gameID) {
        const game = liveGames[gameID];
        if (game) {
          socket.leave(gameID);
          game.removePlayer(socket.id);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(`socket has disconnected ${socket.id}`);
    });
  });
};

module.exports = doSocket;
