import React from "react";
import Button from "./Button";
import IMessage from "../interfaces/IMessage";
import "./message.css";

interface IMessageProps {
  messages?: IMessage[];
  onSend?: (value: string) => void;
}

export default function Message(props: IMessageProps) {
  const scrollRef = React.useRef<HTMLDivElement>();
  const { messages = [] } = props;
  let buttons;
  if (messages.length) {
    buttons = messages[messages.length - 1].buttons;
  }

  React.useEffect(() => {
    const el = scrollRef.current as HTMLDivElement;
    const scrollTop = Math.max(el.scrollHeight - el.clientHeight, 0);
    el.scrollTop = scrollTop;
  }, [props.messages]);

  return (
    <div className="Message">
      <div className="Message_wrapper" ref={scrollRef}>
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={`Message_cloud Message_cloud_style-${
                message.isBot ? "bot" : "user"
              }`}
            >
              <span className="Message_cloud_text">{message.text}</span>
              <time className="Message_cloud_date">{message.date}</time>
            </div>
          );
        })}
      </div>
      {buttons && (
        <div className="Message_buttons-block">
          {buttons.map((button, index) => {
            return (
              <Button
                key={index}
                style="secondary"
                caption={button}
                onClick={() => {
                  props.onSend?.(button);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
