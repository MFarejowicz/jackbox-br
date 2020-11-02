import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./styles.css";

import Lobby from "@components/Lobby";
import RoundTransition from "@components/RoundTransition";

import socket from "@app/socket";

const Game = (props) => {
  const [gameState, setGameState] = useState("lobby");

  useEffect(() => {
    socket.on("GAME_STATE_UPDATE", (data) => {
      setGameState(data.newState);
    });

    return () => {
      socket.off("GAME_STATE_UPDATE");
    };
  }, []);

  switch (gameState) {
    case "lobby":
      return <Lobby identity={props.identity} setIdentity={props.setIdentity} />;
    case "pre-round-1":
    case "pre-round-2":
    case "pre-round-3":
    case "pre-round-4":
    case "pre-round-5": {
      const round = parseInt(gameState.charAt(gameState.length - 1), 10);
      return <RoundTransition round={round} />;
    }
    case "round-1":
      return <div>round 1</div>;
    default:
      return <div>oops, game state error</div>;
  }
};

Game.propTypes = {
  identity: PropTypes.string,
  setIdentity: PropTypes.func.isRequired,
};

export default Game;
