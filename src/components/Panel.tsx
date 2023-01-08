import React from "react";
import "./panel.css";

interface IPanelProps {
  /**
   * Текст в заголовке
   */
  caption?: string;
  /**
   * Основное содержимое панели
   */
  children?: React.ReactElement;
  /**
   * Содержимое, отображаемое в самом низу панели
   */
  footerTemplate?: React.ReactElement;
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
export default function Panel(props: IPanelProps): React.ReactElement {
  return (
    <div className={`Panel ${props.className || ''}`}>
      <div className="Panel_header">
        <span className="Panel_header-caption">{props.caption}</span>
        <i
          className="Panel_header_close"
          onClick={() => {
            props.onClose?.();
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 25 25" fill="none">
            <path d="M18 7L7 18M7 7L18 18" stroke="#fff" strokeWidth="1.2"/>
          </svg>
        </i>
      </div>
      <div className="Panel_content">{props.children}</div>
      {props.footerTemplate && (<div className="Panel_footer">{props.footerTemplate}</div>)}
    </div>
  );
}
