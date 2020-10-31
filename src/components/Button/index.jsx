import React from "react";
import PropTypes from "prop-types";

import "./styles.css";

const Button = (props) => {
  return (
    <button className="Button-button" type="button" onClick={props.onClick}>
      {props.children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default Button;
