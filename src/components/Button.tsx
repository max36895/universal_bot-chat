import "./button.css";
import React from "react";

interface IButtonProps {
  fontSize?: "s" | "m" | "l";
  readOnly?: boolean;
  size?: "s" | "m" | "l";
  style?: "primary" | "secondary";
  viewMode?: "filled" | "outlined";
  captionPosition?: "start" | "end";
  icon?: string;
  caption?: string;
  className?: string;
  title?: string;
  children?: React.ReactElement;
  onClick?: (e?: React.MouseEvent) => void;
}

export default function Button(props: IButtonProps) {
  const {
    size = "m",
    fontSize = "m",
    style = "primary",
    viewMode = "outlined",
    captionPosition = "end",
    readOnly
  } = props;

  const onClickHandler = (e: React.MouseEvent) => {
    if (!readOnly) {
      props.onClick?.(e);
    }
  };

  const className = `Button Button_size-${size} Button_size-${size}-${
    props.icon && !props.caption ? "circle" : "button"
  } Button_font-size-${fontSize} Button_style-${style} Button_mode-${viewMode} ${
    props.className || ""
  }`;
  let content;
  if (props.children) {
    content = props.children;
  } else {
    let icon = null;
    if (props.icon) {
      icon = <i className={`Button_icon ${props.icon}`} />;
    }
    let caption = null;
    if (props.caption) {
      const paddingClass = icon
        ? " Button_caption-padding-" + captionPosition
        : "";
      caption = (
        <span
          className={`Button_caption Button_caption-position-${captionPosition}${paddingClass}`}
        >
          {props.caption}
        </span>
      );
    }
    content = (
      <>
        {icon}
        {caption}
      </>
    );
  }

  return (
    <button title={props.title} className={className} onClick={onClickHandler}>
      {content}
    </button>
  );
}
