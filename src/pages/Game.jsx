import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "@components/Button";

import socket from "@app/socket";

const Game = () => {
  const [players, setPlayers] = useState([]);
  const { gameID } = useParams();

  useEffect(() => {
    socket.on("ADD_PLAYER", (data) => {
      setPlayers(data.players);
    });

    return () => {
      socket.off("ADD_PLAYER");
    };
  }, []);

  return (
    <div>
      <div>this is game {gameID}!</div>
      <div>Current players: </div>
      <ul>
        {players.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>
      <Button>Start</Button>
      <Button>Leave</Button>
    </div>
  );
};

export default Game;
