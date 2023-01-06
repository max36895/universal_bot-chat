import React from "react";
import "./panel.css";

interface IPanelProps {
  caption?: string;
  children?: React.ReactElement;
  footerTemplate?: React.ReactElement;
  onSend?: (value: string) => void;
  onClose?: () => void;
}

export default function Panel(props: IPanelProps) {
  return (
    <div className="Panel">
      <div className="Panel_header">
        <span className="Panel_header-caption">{props.caption}</span>
        <i
          className="Panel_header_close"
          onClick={() => {
            props.onClose?.();
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 25 25" fill="none">
            <path d="M18 7L7 18M7 7L18 18" stroke="#fff" stroke-width="1.2"/>
          </svg>
        </i>
      </div>
      <div className="Panel_content">{props.children}</div>
      {props.footerTemplate && (<div className="Panel_footer">{props.footerTemplate}</div>)}
    </div>
  );
}
