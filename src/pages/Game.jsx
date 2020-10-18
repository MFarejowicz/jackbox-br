import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import socket from "@app/socket";

const Game = () => {
  const { gameID } = useParams();

  useEffect(() => {
    socket.on("COUNTDOWN", (data) => {
      console.log(data);
    });

    return () => {
      socket.off("COUNTDOWN");
    };
  }, []);

  return <div>this is game {gameID}!</div>;
};

export default Game;
