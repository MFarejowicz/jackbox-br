import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Wheel from "@components/Wheel";
import "./styles.css";

import socket from "@app/socket";

const gameOptions = {
  1: [{ option: "A" }, { option: "B" }, { option: "C" }],
  2: [{ option: "D" }, { option: "E" }, { option: "F" }],
  3: [{ option: "G" }, { option: "H" }, { option: "I" }],
  4: [{ option: "J" }, { option: "K" }, { option: "L" }],
  5: [{ option: "M" }, { option: "N" }, { option: "O" }],
};

const RoundTransition = (props) => {
  const [winIndex, setWinIndex] = useState(null);

  useEffect(() => {
    socket.on("TRANSITION_UPDATE", (data) => {
      setWinIndex(data.winIndex);
    });

    return () => {
      socket.off("TRANSITION_UPDATE");
    };
  }, []);

  return (
    <div>
      <h2>Transitioning to round {props.round}!</h2>
      <Wheel spinning={winIndex !== null} data={gameOptions[props.round]} winIndex={winIndex} />
    </div>
  );
};

RoundTransition.propTypes = {
  round: PropTypes.number.isRequired,
};

export default RoundTransition;
