import React from "react";
import PropTypes from "prop-types";

import "./styles.css";

const Input = (props) => {
  return (
    <div className="Input-container">
      <div className="Input-main">
        {props.label && (
          <label className="Input-label" htmlFor={props.id}>
            {props.label}
          </label>
        )}
        <input
          className="Input-input"
          type={props.type}
          id={props.id}
          value={props.value}
          onChange={props.onChange}
        />
      </div>
      {props.error && <div className="Input-error">{props.error}</div>}
    </div>
  );
};

Input.propTypes = {
  error: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Input;
