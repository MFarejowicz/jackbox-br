import React, { createRef, useEffect } from "react";
import PropTypes from "prop-types";

const clamp = (min, max, val) => Math.min(Math.max(min, +val), max);

const drawWheel = (canvasRef, data, drawWheelProps) => {
  const QUANTITY = data.length;
  /* eslint-disable prefer-const */
  let {
    outerBorderColor,
    outerBorderWidth,
    innerRadius,
    innerBorderColor,
    innerBorderWidth,
    radiusLineColor,
    radiusLineWidth,
    fontSize,
    perpendicularText,
    textDistance,
  } = drawWheelProps;
  /* eslint-enable prefer-const */

  outerBorderWidth *= 2;
  innerBorderWidth *= 2;
  radiusLineWidth *= 2;
  fontSize *= 2;

  const canvas = canvasRef.current;
  if (canvas?.getContext("2d")) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 500, 500);
    ctx.strokeStyle = "transparent";
    ctx.lineWidth = 0;
    // ctx.translate(0.5, 0.5)

    const arc = Math.PI / (QUANTITY / 2);
    const startAngle = 0;
    const outsideRadius = canvas.width / 2 - 10;

    const clampedTextDistance = clamp(0, 100, textDistance);
    const textRadius = (outsideRadius * clampedTextDistance) / 100;

    const clampedInsideRadius = clamp(0, 100, innerRadius);
    const insideRadius = (outsideRadius * clampedInsideRadius) / 100;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.font = `bold ${fontSize}px Helvetica, Arial`;

    for (let i = 0; i < data.length; i += 1) {
      const angle = startAngle + i * arc;
      const { style } = data[i];
      ctx.fillStyle = style && style.backgroundColor;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outsideRadius, angle, angle + arc, false);
      ctx.arc(centerX, centerY, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();

      // WHEEL RADIUS LINES
      ctx.strokeStyle = radiusLineWidth <= 0 ? "transparent" : radiusLineColor;
      ctx.lineWidth = radiusLineWidth;
      for (let j = 0; j < data.length; j += 1) {
        const radiusAngle = startAngle + j * arc;
        ctx.beginPath();
        ctx.moveTo(
          centerX + (insideRadius + 1) * Math.cos(radiusAngle),
          centerY + (insideRadius + 1) * Math.sin(radiusAngle)
        );
        ctx.lineTo(
          centerX + (outsideRadius - 1) * Math.cos(radiusAngle),
          centerY + (outsideRadius - 1) * Math.sin(radiusAngle)
        );
        ctx.closePath();
        ctx.stroke();
      }

      // WHEEL OUTER BORDER
      ctx.strokeStyle = outerBorderWidth <= 0 ? "transparent" : outerBorderColor;
      ctx.lineWidth = outerBorderWidth;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outsideRadius - ctx.lineWidth / 2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();

      // WHEEL INNER BORDER
      ctx.strokeStyle = innerBorderWidth <= 0 ? "transparent" : innerBorderColor;
      ctx.lineWidth = innerBorderWidth;
      ctx.beginPath();
      ctx.arc(centerX, centerY, insideRadius + ctx.lineWidth / 2 - 1, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();

      // TEXT FILL
      ctx.fillStyle = style && style.textColor;
      ctx.translate(
        centerX + Math.cos(angle + arc / 2) * textRadius,
        centerY + Math.sin(angle + arc / 2) * textRadius
      );
      const text = data[i].option;
      const textRotationAngle = perpendicularText ? angle + arc / 2 + Math.PI / 2 : angle + arc / 2;
      ctx.rotate(textRotationAngle);
      ctx.fillText(text, -ctx.measureText(text).width / 2, fontSize / 2.7);
      ctx.restore();
    }
  }
};

const WheelCanvas = ({
  width,
  height,
  data,
  outerBorderColor,
  outerBorderWidth,
  innerRadius,
  innerBorderColor,
  innerBorderWidth,
  radiusLineColor,
  radiusLineWidth,
  fontSize,
  perpendicularText,
  textDistance,
}) => {
  const canvasRef = createRef();
  const drawWheelProps = {
    outerBorderColor,
    outerBorderWidth,
    innerRadius,
    innerBorderColor,
    innerBorderWidth,
    radiusLineColor,
    radiusLineWidth,
    fontSize,
    perpendicularText,
    textDistance,
  };

  useEffect(() => {
    drawWheel(canvasRef, data, drawWheelProps);
  }, [canvasRef, data, drawWheelProps]);

  return (
    <canvas style={{ width: "98%", height: "98%" }} ref={canvasRef} width={width} height={height} />
  );
};

WheelCanvas.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      option: PropTypes.string.isRequired,
      style: PropTypes.shape({
        backgroundColor: PropTypes.string,
        textColor: PropTypes.string,
      }),
    })
  ).isRequired,
  outerBorderColor: PropTypes.string,
  outerBorderWidth: PropTypes.number,
  innerRadius: PropTypes.number,
  innerBorderColor: PropTypes.string,
  innerBorderWidth: PropTypes.number,
  radiusLineColor: PropTypes.string,
  radiusLineWidth: PropTypes.number,
  fontSize: PropTypes.number,
  perpendicularText: PropTypes.bool,
  textDistance: PropTypes.number,
};

export default WheelCanvas;
