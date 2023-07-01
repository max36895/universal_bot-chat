import "./button.css";
import {ReactElement, LegacyRef, MouseEvent, cloneElement, isValidElement, memo} from "react";

export type TButtonSize = 's' | 'm' | 'l';
export type TButtonViewMode = 'filled' | 'outlined';
export type TButtonStyle = 'primary' | 'secondary';

interface IButtonProps {
    /**
     * Размер текста в кнопке
     * @default m
     */
    fontSize?: TButtonSize;
    /**
     * Определяет режим отображения 'только для чтения'.
     */
    readOnly?: boolean;
    /**
     * Размер кнопки
     * @default m
     */
    size?: TButtonSize;
    /**
     * Стиль кнопки
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
    icon?: string | ReactElement;
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
    children?: ReactElement;
    forwardedRef?: LegacyRef<HTMLButtonElement>;
    /**
     * Событие клика
     * @param e
     * @returns
     */
    onClick?: (e?: MouseEvent) => void;
}

/**
 * Компонент кнопка
 * @param props
 * @returns ReactElement
 */
export default function Button(props: IButtonProps): ReactElement {
    const {
        size = "m",
        fontSize = "m",
        style = "primary",
        viewMode = "outlined",
        captionPosition = "end",
        readOnly
    } = props;

    const onClickHandler = (e: MouseEvent) => {
        if (!readOnly) {
            props.onClick?.(e);
        }
    };

    const className = `um-Button um-Button_size-${size} um-Button_size-${size}-${
        props.icon && !props.caption ? "circle" : "button"
    }${props.icon && !props.caption ? " um-Button-circle" : ""} um-font-size-${fontSize} um-Button_style-${readOnly ? 'readonly' : style}${
        readOnly ? '' : ' um-clickable'
    } um-Button_mode-${viewMode} ${
        props.className || ""
    }`;

    let content;
    if (props.children) {
        content = props.children;
    } else {
        let icon = null;
        if (props.icon) {
            if (typeof props.icon !== 'string' && isValidElement(props.icon as ReactElement)) {
                icon = cloneElement(props.icon as ReactElement, {
                    className: `${props.icon.props?.className || ''} um-Button_icon_size-${size}`
                })
            } else {
                icon = <i className={`um-Button_icon ${props.icon}`}/>;
            }
        }

        let caption = null;
        if (props.caption) {
            const paddingClass = icon
                ? ` um-Button_caption-padding-${captionPosition}`
                : '';
            caption = (
                <span
                    className={`um-Button_caption um-Button_caption-position-${captionPosition}${paddingClass}`}
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
        <button ref={props.forwardedRef}
                title={props.title}
                className={className}
                onClick={onClickHandler}>
            {content}
        </button>
    );
}