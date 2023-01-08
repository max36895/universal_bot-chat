import "./button.css";
import React from "react";

export type TButtonSize = 's' | 'm' | 'l';
export type TButtonViewMode = 'filled' | 'outlined';
export type TButtonStyle = 'primary' | 'secondary';

interface IButtonProps {
  /**
   * Размер текста в кнопке
   * @default m
   */
  fontSize?: TButtonSize;
  readOnly?: boolean;
  /**
   * Размер кнопки
   * @default m
   */
  size?: TButtonSize;
  /**
   * Cтиль кнопки
   * @default primary
   */
  style?: TButtonStyle;
  /**
   * Режим отображения кнопки
   * @default outlined
   */
  viewMode?: TButtonViewMode;
  /**
   * Расположение текста в кнопке
   * @default end
   */
  captionPosition?: "start" | "end";
  /**
   * Иконка кнопки
   */
  icon?: string | React.ReactElement;
  /**
   * Текст внутри кнопки
   */
  caption?: string;
  /**
   * Класс, который будет навешен на кнопку
   */
  className?: string;
  /**
   * Текст, который будет отображен при наведении на кнопку
   */
  title?: string;
  /**
   * Содержимое, которое будет отображено в кнопке
   */
  children?: React.ReactElement;
  forwardedRef?: React.LegacyRef<HTMLButtonElement>;
  /**
   * Событие клика
   * @param e 
   * @returns 
   */
  onClick?: (e?: React.MouseEvent) => void;
}

/**
 * Компонент кнопка
 * @param props 
 * @returns React.ReactElement
 */
export default function Button(props: IButtonProps): React.ReactElement {
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
      if (typeof props.icon !== 'string' && React.isValidElement(props.icon as React.ReactElement)) {
        icon = React.cloneElement(props.icon as React.ReactElement, {
          className: `${props.icon.props.className} Button_icon_size-${size}`
        })
      } else {
        icon = <i className={`Button_icon ${props.icon}`} />;
      }
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
    <button ref={props.forwardedRef} title={props.title} className={className} onClick={onClickHandler}>
      {content}
    </button>
  );
}
