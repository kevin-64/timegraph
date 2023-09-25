import React from 'react';
import TooltipProps from "./TooltipProps";

const Tooltip = ({x, y, visible, content}: TooltipProps) => {
  return (
    <div style={{position: 'absolute', top: y, left: x, display: visible ? 'block' : 'none', color: 'white', backgroundColor: 'gray', zIndex: 999}}>{content}</div>
  )
}

export default Tooltip;
