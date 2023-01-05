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
          }}
        >
          ✖
        </i>
      </div>
      <div className="Panel_content">{props.children}</div>
      <div className="Panel_footer">{props.footerTemplate}</div>
    </div>
  );
}
