import * as React from "react";

export interface BlockIconProps {
  selected?: boolean;
  className?: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const BlockIcon = ({
  selected = false,
  className = "",
  width = "16",
  height = "16",
  style = {},
  onClick
}: BlockIconProps): JSX.Element => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    height={width}
    width={height}
    className={className}
    style={style}
    onClick={onClick} >
      <path
        d="M0 0h24v24H0z"
        fill="none" />
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm5.31-3.1L6.1 5.69C7.45 4.63 9.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
        style={{ fill: selected ? "#e53935" : undefined }} />
  </svg>
);

export default BlockIcon;
