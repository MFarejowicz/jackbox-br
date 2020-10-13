import React from "react";

import "./Input.css";

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

export default Input;
