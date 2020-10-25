/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";

import Selector from "./roulette-selector.png";
import WheelCanvas from "./WheelCanvas";
import "./Wheel.css";

export const DEFAULT_BACKGROUND_COLORS = ["#70D6FF", "#FF70A6", "#FF9770", "#FFD670", "#E9FF70"];
export const DEFAULT_TEXT_COLORS = ["black"];
export const DEFAULT_OUTER_BORDER_COLOR = "black";
export const DEFAULT_OUTER_BORDER_WIDTH = 3;
export const DEFAULT_INNER_RADIUS = 0;
export const DEFAULT_INNER_BORDER_COLOR = "black";
export const DEFAULT_INNER_BORDER_WIDTH = 0;
export const DEFAULT_RADIUS_LINE_COLOR = "black";
export const DEFAULT_RADIUS_LINE_WIDTH = 3;
export const DEFAULT_FONT_SIZE = 20;
export const DEFAULT_TEXT_DISTANCE = 60;

export const clamp = (min, max, val) => Math.min(Math.max(min, +val), max);

const START_SPINNING_TIME = 2600;
const CONTINUE_SPINNING_TIME = 750;
const STOP_SPINNING_TIME = 8000;

const Wheel = ({
  spinning,
  prizeNumber,
  data,
  onStopSpinning = () => null,
  backgroundColors = DEFAULT_BACKGROUND_COLORS,
  textColors = DEFAULT_TEXT_COLORS,
  outerBorderColor = DEFAULT_OUTER_BORDER_COLOR,
  outerBorderWidth = DEFAULT_OUTER_BORDER_WIDTH,
  innerRadius = DEFAULT_INNER_RADIUS,
  innerBorderColor = DEFAULT_INNER_BORDER_COLOR,
  innerBorderWidth = DEFAULT_INNER_BORDER_WIDTH,
  radiusLineColor = DEFAULT_RADIUS_LINE_COLOR,
  radiusLineWidth = DEFAULT_RADIUS_LINE_WIDTH,
  fontSize = DEFAULT_FONT_SIZE,
  perpendicularText = false,
  textDistance = DEFAULT_TEXT_DISTANCE,
}) => {
  const wheelData = useRef([...data]);
  const [hasStartedSpinning, setHasStartedSpinning] = useState(false);
  const [hasStoppedSpinning, setHasStoppedSpinning] = useState(false);
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const startSpinning = () => {
    setHasStartedSpinning(true);
    setTimeout(() => {
      setHasStoppedSpinning(true);
    }, START_SPINNING_TIME + CONTINUE_SPINNING_TIME + STOP_SPINNING_TIME - 300);
  };

  useEffect(() => {
    const dataLength = data.length;
    wheelData.current = [...data];
    for (let i = 0; i < dataLength; i += 1) {
      wheelData.current[i] = {
        ...data[i],
        style: {
          backgroundColor:
            data[i].style?.backgroundColor || backgroundColors[i % backgroundColors.length],
          textColor: data[i].style?.textColor || textColors[i % textColors.length],
        },
      };
    }
    setIsDataUpdated(true);
  }, [data, backgroundColors, textColors]);

  useEffect(() => {
    if (spinning) {
      startSpinning();
    }
  }, [data.length, spinning, prizeNumber]);

  useEffect(() => {
    if (hasStoppedSpinning) {
      onStopSpinning();
    }
  }, [hasStoppedSpinning, onStopSpinning]);

  const getRouletteClass = () => {
    if (hasStartedSpinning) {
      return `Rotation-container started-spinning${prizeNumber}`;
    }
    return "Rotation-container";
  };

  if (!isDataUpdated) {
    return null;
  }

  return (
    <div className="Roulette-container">
      <div className={getRouletteClass()}>
        <WheelCanvas
          width="900"
          height="900"
          data={wheelData.current}
          outerBorderColor={outerBorderColor}
          outerBorderWidth={outerBorderWidth}
          innerRadius={innerRadius}
          innerBorderColor={innerBorderColor}
          innerBorderWidth={innerBorderWidth}
          radiusLineColor={radiusLineColor}
          radiusLineWidth={radiusLineWidth}
          fontSize={fontSize}
          perpendicularText={perpendicularText}
          textDistance={textDistance}
        />
      </div>
      <img className="Roulette-selector-image" src={Selector} alt="roulette-selector" />
    </div>
  );
};

export default Wheel;