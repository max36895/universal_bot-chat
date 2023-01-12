import {ReactElement, useState, useEffect, CSSProperties} from "react";
import detection from "../utils/detection";
import './popup.css'

interface IPopupProps {
    /**
     * Контент, отображаемый внутри компонента
     */
    children: ReactElement;
    /**
     * Режим отображения окна
     * @default false
     */
    opened: boolean;
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

interface IUseMountProps {
    opener: boolean;
}

function getPosition(props: IPopupProps): CSSProperties {
    const positionStyle: CSSProperties = {};
    if (detection.isMobile) {
        positionStyle.width = '100vw';
        positionStyle.height = '100vh';
    } else {
        let viewport: {width: number, height: number};
        if (visualViewport) {
            viewport = {
                width: visualViewport.width,
                height: visualViewport.height
            };
        } else {
            viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
        positionStyle.width = Math.min(props.width, viewport.width) + 'px';
        positionStyle.height = Math.min(props.height, viewport.height) + 'px';
        if (props.target) {
            const clientRect = props.target.getBoundingClientRect();
            positionStyle.top = clientRect.bottom - props.height > 0 ? (clientRect.bottom - props.height) : (clientRect.top);
            positionStyle.left = clientRect.right - props.width > 0 ? (clientRect.right - props.width) : (clientRect.left);
        } else {
            positionStyle.top = (viewport.width - props.width) / 2;
            positionStyle.left = (viewport.height - props.height) / 2;
        }
    }
    return positionStyle;
}

export function usePopup(props: IPopupProps) {
    const [mounted, setMounted] = useState<boolean>(false);
    const [style, setStyle] = useState<CSSProperties>({opacity: 0})
    useEffect(() => {
        if (props.opened && !mounted) {
            setStyle(getPosition(props));
            setMounted(true);
        } else if (!props.opened && mounted) {
            const hiddenStyle = {...style};
            if (detection.isMobile) {
                hiddenStyle.top = '100vh';
                hiddenStyle.transition = 'top 0.6s';
            } else {
                hiddenStyle.opacity = 0;
                hiddenStyle.transition = 'opacity 300ms';
            }
            setStyle(hiddenStyle);
            setTimeout(() => {
                setMounted(false);
            }, detection.isMobile ? 900 : 500);
        }
    }, [props.opened]);

    return {
        isVisible: mounted,
        style,
        close: () => {setMounted(false)}
    };
}

/**
 * Компонент, позволяющий отображать окна.
 * @param props
 * @returns
 */
const Popup = (props: IPopupProps): ReactElement | null => {
    const {isVisible, close, style} = usePopup(props);

    if (!isVisible) {
        return null;
    }

    return <div className="Popup" style={style} onTransitionEnd={close}>{props.children}</div>;
}

export default Popup;