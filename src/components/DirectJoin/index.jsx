import React, { useState } from "react";
import PropTypes from "prop-types";

import Button from "@components/Button";
import Input from "@components/Input";

import socket from "@app/socket";

const DirectJoin = (props) => {
  const [name, setName] = useState("");

  const [errors, setErrors] = useState({ name: "" });

  const onNameChange = (ev) => {
    setErrors((prevErrors) => ({ ...prevErrors, name: "" }));

    const val = ev.target.value;
    setName(val);
  };

  const onJoin = () => {
    let valid = true;
    if (!name) {
      setErrors((prevErrors) => ({ ...prevErrors, name: "Please enter a name!" }));
      valid = false;
    }

    if (valid) {
      socket.emit("JOIN_GAME", { name, leader: false, gameID: props.gameID }, (error) => {
        if (!error) {
          props.onJoin(name);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            name: error,
          }));
        }
      });
    }
  };

  return (
    <div>
      <Input
        type="text"
        id="join-name"
        label="Name:"
        value={name}
        onChange={onNameChange}
        error={errors.name}
      />
      <div>Game: {props.gameID}</div>
      <Button onClick={onJoin}>Join</Button>
      <Button onClick={props.onLeave}>Main Menu</Button>
    </div>
  );
};

DirectJoin.propTypes = {
  gameID: PropTypes.string.isRequired,
  onJoin: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
};

export default DirectJoin;
