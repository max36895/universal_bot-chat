import React from "react";
import Button, {TButtonSize, TButtonViewMode, TButtonStyle} from "./Button";
import Panel from "./Panel";
import InputBlock from "./InputBlock";
import CardsList from "./CardsList";
import {ICardButton, ICards} from "../interfaces/ICards";
import CardsModel, { IRequestParser } from "../api/CardsModel";
import "./uChat.css";
import Voice from "../api/Voice";

interface IUChatProps {
  buttonViewMode?: TButtonViewMode;
  buttonSize?: TButtonSize;
  buttonIcon?: string;
  buttonStyle?: TButtonStyle;
  buttonCaption?: string;
  panelTitle?: string;
  isVoiceControl?: boolean;
  botUrl: string;
  reqestParser?: IRequestParser;
  userId?: string
}

export default function UChat(props: IUChatProps) {
  const [panelVisible, setPanelVisible] = React.useState(false);
  const [buttonVisible, setButtonVisible] = React.useState(true);
  const [cards, setCards] = React.useState<ICards[]>([]);
  const [cardsModel] = React.useState(new CardsModel(props.botUrl, props.userId, props.reqestParser));
  const [voice] = React.useState(new Voice());
  const {buttonIcon = 'icon-info', 
         buttonSize = 'l', 
         isVoiceControl = true, 
         buttonViewMode, 
         buttonStyle, 
         buttonCaption} = props;

  React.useEffect(() => {
    cardsModel.setUrl(props.botUrl);
  }, [props.botUrl]);

  React.useEffect(() => {
    cardsModel.setUserId(props.userId);
  }, [props.userId]);

  React.useEffect(() => {
    cardsModel.setParser(props.reqestParser);
  }, [props.reqestParser]);

  const toggleHandler = () => {
    setPanelVisible(!panelVisible);

    if (panelVisible) {
      setTimeout(() => {
        setButtonVisible(!buttonVisible);
      }, 850);
    } else {
      setButtonVisible(!buttonVisible);
    }
  };

  const sendHandler = (value: string) => {
    if (value.trim()) {
      setCards(cardsModel.addUserText(cards, value));

      cardsModel.send(value).then((res) => {
        setCards(cardsModel.addBotText(cards, res));
        if (isVoiceControl) {
            const text = cardsModel.getTTS(res);
            if (text) {
              voice.speak(text);
            }
        }
      });
    }
  };

  const sendCardHandlet = (value: ICardButton): void => {
    voice.speakStop();
    if (value.url) {
      window.open(value.url, '_blank');
    } else {
      sendHandler(value.title);
    }
  }

  return (
    <div className={`UChat ${panelVisible ? "UChat_visible" : ""}`}>
      {buttonVisible ? (
        <Button
          onClick={toggleHandler} 
          size={buttonSize}
          icon={buttonIcon} 
          viewMode={buttonViewMode} 
          caption={buttonCaption}
          style={buttonStyle}/>
      ) : (
        <Panel
          caption={props.panelTitle}
          footerTemplate={<InputBlock onSend={sendHandler} isVoiceControl={isVoiceControl}/>}
          onClose={toggleHandler}
          onSend={sendHandler}>
          <CardsList cards={cards} onSend={sendCardHandlet} />
        </Panel>
      )}
    </div>
  );
}
