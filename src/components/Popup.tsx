import React from "react";
import detection from "../utils/detection";
import './popup.css'

interface IPopupProps {
    /**
     * Контент, отображаемый внутри компонента
     */
    children: React.ReactElement;
    /**
     * Режим отображения окна
     * @default false
     */
    visible: boolean;
    /**
     * Ширина окна
     */
    width: number;
    /**
     * Высота окна
     */
    height: number;
    /**
     * Элемент, относительно которого нужно построиться
     */
    target?: HTMLElement;
}

/**
 * Компонент, позволяющий отображать окна.
 * @param props 
 * @returns 
 */
export default function Popup(props: IPopupProps) {
    const [visible, setVisible] = React.useState(false);
    const [style, setStyle] = React.useState<React.CSSProperties>({opacity: 0})

    React.useEffect(() => {
        if (props.visible) {
            const positionStyle: React.CSSProperties = {};
            if (detection.isMobile) {
                positionStyle.width = '100vw';
                positionStyle.height = '100vh';
            } else {
                positionStyle.width = Math.min(props.width, visualViewport.width) + 'px';
                positionStyle.height = Math.min(props.height, visualViewport.height) + 'px';
                if (props.target) {
                    const clientRect = props.target.getBoundingClientRect();
                    positionStyle.top = clientRect.bottom - props.height > 0 ? (clientRect.bottom - props.height) : (clientRect.top);
                    positionStyle.left = clientRect.right - props.width > 0 ? (clientRect.right - props.width) : (clientRect.left);
                } else {
                    positionStyle.top = (visualViewport.width - props.width) / 2;
                    positionStyle.left = (visualViewport.height - props.height) / 2;
                }
            }
            setStyle(positionStyle);
        } else {
            const hiddenStyle = {...style};
            if (detection.isMobile) {
                hiddenStyle.top = '100vh';
                hiddenStyle.transition = 'top 0.7s';
            } else {
                hiddenStyle.opacity = 0;
                hiddenStyle.transition = 'opacity 300ms';
            }
            setStyle(hiddenStyle);
        }

        if (!props.visible) {
            setTimeout(() => {
                setVisible(props.visible);
            }, detection.isMobile ? 690 : 290);
        } else {
            setVisible(props.visible);
        }
    }, [props.visible]);

    return <>
        {
            visible ? (<div className="Popup" style={style}>{props.children}</div>) : null
        }
    </>
}