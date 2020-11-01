import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import "./styles.css";

import Button from "@components/Button";
import DirectJoin from "@components/DirectJoin";

import socket from "@app/socket";

const Lobby = (props) => {
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
    props.setIdentity(name);
  };

  const onStart = () => {
    socket.emit("START_GAME");
  };

  const onLeave = () => {
    socket.emit("LEAVE_GAME");
    props.setIdentity(null);
    setLeave(true);
  };

  const isLeader = () => {
    if (!props.identity) return false;

    const me = players.find((el) => el.name === props.identity);
    if (!me) return false;

    return me.leader;
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
            <li key={player.name}>
              <span>{player.name}</span>
              {props.identity === player.name && (
                <span className="Lobby-leader-shtick">{"<- That's you!"}</span>
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
        {isLeader() && <Button onClick={onStart}>Start</Button>}
        <Button onClick={onLeave}>Leave</Button>
      </div>
    </div>
  );
};

Lobby.propTypes = {
  identity: PropTypes.string,
  setIdentity: PropTypes.func.isRequired,
};

export default Lobby;
