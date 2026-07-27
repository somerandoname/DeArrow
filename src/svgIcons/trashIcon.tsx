import * as React from "react";

export interface TrashIconProps {
  selected?: boolean;
  className?: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const TrashIcon = ({
  selected = false,
  className = "",
  width = "16",
  height = "16",
  style = {},
  onClick
}: TrashIconProps): JSX.Element => (
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
        fill="none"
        id="path2" />
      <path
        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
        id="path4"
        style={{ fill: selected ? "#0a62a5" : undefined }} />
  </svg>
);

export default TrashIcon;
