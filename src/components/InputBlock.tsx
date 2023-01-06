import React from "react";
import Button from "./Button";
import Voice from "../api/Voice";
import "./inputBlock.css";

interface IInputBlockProps {
  isVoiceControl?: boolean;
  onSend?: (value: string) => void;
}

const ICON_VOICE = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
<path d="M12 14.2857C13.4229 14.2857 14.5714 13.1371 14.5714 11.7143V6.57143C14.5714 5.14857 13.4229 4 12 4C10.5771 4 9.42857 5.14857 9.42857 6.57143V11.7143C9.42857 13.1371 10.5771 14.2857 12 14.2857Z" fill="#000000"/>
<path d="M16.5429 11.7143H18C18 14.6371 15.6686 17.0543 12.8571 17.4743V20.2857H11.1429V17.4743C8.33143 17.0543 6 14.6371 6 11.7143H7.45714C7.45714 14.2857 9.63429 16.0857 12 16.0857C14.3657 16.0857 16.5429 14.2857 16.5429 11.7143Z" fill="#000000"/>
</svg>

const ICON_LISTEN = <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32" xmlSpace="preserve">
  <path fill="#333333" d="M11,6v20H9V6H11z M26,8h-2v16h2V8z M32,14h-2v4h2V14z M8,10H6v12h2V10z M5,12H3v8h2V12z M2,14H0v4  h2V14z M14,3h-2v26h2V3z M17,6h-2v20h2V6z M20,2h-2v28h2V2z M23,5h-2v22h2V5z M29,11h-2v10h2V11z"/>
</svg>

export default function InputBlock(props: IInputBlockProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>();
  const [voice] = React.useState(new Voice());
  const [voiceIcon, setVoiceIcon] = React.useState(ICON_VOICE);

  React.useEffect(() => {
    voice.setWatchSpeak((value) => {
      (inputRef.current as HTMLTextAreaElement).value = value;
    });

    if (inputRef.current) {
      inputRef.current.focus();
    }

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
    if (props.isVoiceControl) {
      if (voice.isSpeak()) {
        voice.speakStop();
      }
      if (voice.isSpeach()) {
        setVoiceIcon(ICON_VOICE);
        voice.speechStop();
        return;
      }
      setVoiceIcon(ICON_LISTEN);
      voice
        .speech()
        .then((val) => {
          onSend(val as string);
          setVoiceIcon(ICON_VOICE);
        })
        .catch();
    }
  };

  const iconSend = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <path d="M6.99811 10.2467L7.43298 11.0077C7.70983 11.4922 7.84825 11.7344 7.84825 12C7.84825 12.2656 7.70983 12.5078 7.43299 12.9923L7.43298 12.9923L6.99811 13.7533C5.75981 15.9203 5.14066 17.0039 5.62348 17.5412C6.1063 18.0785 7.24961 17.5783 9.53623 16.5779L15.8119 13.8323C17.6074 13.0468 18.5051 12.654 18.5051 12C18.5051 11.346 17.6074 10.9532 15.8119 10.1677L9.53624 7.4221C7.24962 6.42171 6.1063 5.92151 5.62348 6.45883C5.14066 6.99615 5.75981 8.07966 6.99811 10.2467Z" stroke="#222222"/>
  </svg>;

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
          size="m"
          title="Отправить"
          icon={iconSend}
          onClick={onClickHandler}
        />
        {
          props.isVoiceControl && (<Button
              className="margin-top-s"
              icon={voiceIcon}
              size="m"
              title={voice.isSpeach() ? "Пауза" : "Сказать"}
              onClick={onVoiceHandler}
            />)
        }
      </div>
    </div>
  );
}
