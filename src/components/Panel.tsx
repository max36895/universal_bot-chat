import {ReactElement, ReactNode, memo} from "react";
import "./panel.css";

interface IPanelProps {
    /**
     * Текст в заголовке
     */
    caption?: string;
    /**
     * Основное содержимое панели
     */
    children?: ReactNode;
    /**
     * Содержимое, отображаемое в самом низу панели
     */
    footerTemplate?: ReactElement;
    /**
     * Класс, который будет навешен на панель
     */
    className?: string;
    /**
     * Событие для закрытия панели
     * @returns
     */
    onClose?: () => void;
}

/**
 * Компонент панель
 * @param props
 * @returns
 */
const Panel = (props: IPanelProps): ReactElement => {
    return (
        <div className={`um-Panel ${props.className || ''}`}>
            <div className="um-Panel_header">
                <span className="um-Panel_header-caption">{props.caption}</span>
                <i className="um-Panel_header_close"
                   onClick={() => {
                       props.onClose?.();
                   }}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="var(--inline-height-m)"
                         height="var(--inline-height-m)"
                         viewBox="0 0 25 25"
                         fill="none">
                        <path d="M18 7L7 18M7 7L18 18" stroke="var(--contrast_text_color)" strokeWidth="1.2"/>
                    </svg>
                </i>
            </div>
            <div className="um-Panel_content">{props.children}</div>
            {props.footerTemplate && (<div className="um-Panel_footer">{props.footerTemplate}</div>)}
        </div>
    );
}

export default memo(Panel);
