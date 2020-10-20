import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import PropTypes from "prop-types";

import "./Game.css";

import Button from "@components/Button";
import DirectJoin from "@components/DirectJoin";

import socket from "@app/socket";

const Game = (props) => {
  const [players, setPlayers] = useState([]);
  const [leave, setLeave] = useState(false);
  const { gameID } = useParams();

  useEffect(() => {
    socket.on("PLAYERS_UPDATE", (data) => {
      setPlayers(data.players);
    });

    return () => {
      socket.off("PLAYERS_UPDATE");
    };
  }, []);

  const onJoin = (name) => {
    props.setIdentity({ name, leader: false });
  };

  const onLeave = () => {
    socket.emit("LEAVE_GAME");
    setLeave(true);
  };

  if (leave) {
    return <Redirect push to="/" />;
  }

  if (!props.identity) {
    return <DirectJoin gameID={gameID} onJoin={onJoin} onLeave={onLeave} />;
  }

  const renderPlayers = () => {
    return (
      <div>
        <div>Current players: </div>
        <ul>
          {players.map((player) => (
            <li key={player}>
              <span>{player}</span>
              {props.identity.name === player && (
                <span className="Game-leader-shtick">{"<- That's you!"}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <div>This is game {gameID}!</div>
      {renderPlayers()}
      <div>
        {props.identity.leader && <Button>Start</Button>}
        <Button onClick={onLeave}>Leave</Button>
      </div>
    </div>
  );
};

Game.propTypes = {
  identity: PropTypes.exact({
    name: PropTypes.string,
    leader: PropTypes.bool,
  }),
  setIdentity: PropTypes.func.isRequired,
};

export default Game;
