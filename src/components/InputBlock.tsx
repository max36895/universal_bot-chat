import React from "react";
import Button from "./Button";
import Voice from "../api/Voice";
import "./inputBlock.css";

interface IInputBlockProps {
  onSend?: (value: string) => void;
}

export default function InputBlock(props: IInputBlockProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>();
  const [voice] = React.useState(new Voice());
  const [voiceIcon, setVoiceIcon] = React.useState("icon-voice");

  React.useEffect(() => {
    voice.setWatchSpeak((value) => {
      (inputRef.current as HTMLTextAreaElement).value = value;
    });
    return () => {
      voice.speakStop();
      voice.speechStop();
    };
  }, []);

  const onSend = (value: string) => {
    if (props.onSend) {
      props.onSend(value);
    }
    (inputRef.current as HTMLTextAreaElement).value = "";
  };

  const onClickHandler = () => {
    onSend((inputRef.current as HTMLTextAreaElement).value || "");
  };

  const inputHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && !e.ctrlKey) {
      onClickHandler();
    }
  };

  const onVoiceHandler = () => {
    if (voice.isSpeak()) {
      voice.speakStop();
    }
    if (voice.isSpeach()) {
      setVoiceIcon("icon-voice");
      voice.speechStop();
      return;
    }
    setVoiceIcon("icon-sound");
    voice
      .speech()
      .then((val) => {
        onSend(val as string);
        setVoiceIcon("icon-voice");
      })
      .catch();
  };

  return (
    <div className="InputBlock">
      <textarea
        ref={inputRef}
        onKeyUp={inputHandler}
        placeholder="Введите текст"
        className="InputBlock_textarea"
      />
      <div className="InputBlock_buttons">
        <Button
          size="s"
          title="Отправить"
          icon="icon-send"
          onClick={onClickHandler}
        />
        <Button
          className="margin-top-s"
          icon={voiceIcon}
          size="s"
          title={voice.isSpeach() ? "Пауза" : "Сказать"}
          onClick={onVoiceHandler}
        />
      </div>
    </div>
  );
}
