import React from "react";
import { useParams } from "react-router-dom";

const Game = () => {
  const { gameID } = useParams();
  return <div>this is game {gameID}!</div>;
};

export default Game;
