import React from "react";
import Button, {TButtonSize, TButtonViewMode, TButtonStyle} from "./Button";
import Panel from "./Panel";
import Popup from "./Popup";
import InputBlock from "./InputBlock";
import CardsList from "./CardsList";
import {ICardButton, ICards} from "../interfaces/ICards";
import CardsModel, { IRequestParser } from "../api/CardsModel";
import detection from "../utils/detection";
import { setData as defaultSetData, getData as defaultGetData} from "../utils/storage";
import "./uChat.css";
import Voice from "../api/Voice";

interface IDataHandlers<T> {
  /**
   * Сохранение данных
   * @param data Данные для сохранения
   * @returns 
   */
  setData: (data: T) => void;
  /**
   * Получение ранее сохраненных данных
   * @returns 
   */
  getData: () => T;
}

export interface IAppConfig {
  /**
   * Url адресс, на который будет отправляться запрос пользователя
   */
  url: string;
  /**
   * Уникальный идентификатор пользователя
   */
  userId?: string;
  /**
   * Параметры для обработки запроса. По умолчанию используется стандартный обработчик.
   */
  reqestParser?: IRequestParser;
  /**
   * Параметры для сохранения данных. По умолчанию используется стандартный обработчик.
   */
  dataHandlers?: IDataHandlers<ICards[]>;
}

interface IUChatProps {
  /**
   * Класс, который будет навешен на компонент
   */
  className?: string;
  /**
   * Режим отображения кнопки
   */
  buttonViewMode?: TButtonViewMode;
  /**
   * Размер кнопки
   */
  buttonSize?: TButtonSize;
  /**
   * Иконка отображаемая в кнопке
   */
  buttonIcon?: string;
  /**
   * Стиль кнопки
   * @default l
   */
  buttonStyle?: TButtonStyle;
  /**
   * Заголовок кнопки
   */
  buttonCaption?: string;
  /**
   * Заголовок раскрывающейся панели
   */
  panelTitle?: string;
  /**
   * Режим позволяющий взаимодействовать с панельлю через голосовой интерфейс
   * @default true
   */
  isVoiceControl?: boolean;
  /**
   * Режим сохранения данных
   * @default true
   */
  isSavedData?: boolean;
  /**
   * Конфигурация приложения
   */
  config: IAppConfig;
  /**
   * Тема оформления
   * @default default
   */
  theme?: string;
}

/**
 * Компонент, позволяющий открывать окно-чат с ботом, а также обрабатывать команды пользователя, и при необходимости сохранять.
 * Компонент работает в режиме запрос ответ, не подписываясь на возможность получения дополнительных ответов. 1 запрос, 1 ответ
 * @param props Параменты компонента
 * @returns React.ReactElement
 */
export default function UChat(props: IUChatProps): React.ReactElement {
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [cards, setCards] = React.useState<ICards[]>([]);
  const [cardsModel] = React.useState(new CardsModel(props.config.url, props.config.userId, props.config.reqestParser));
  const [voice] = React.useState(new Voice());
  const buttonRef = React.useRef();
  const {buttonIcon = 'icon-info', 
         buttonSize = 'l', 
         isVoiceControl = true,
         isSavedData = true,
         theme = 'default',
         buttonViewMode, 
         buttonStyle, 
         buttonCaption} = props;
  const {setData = defaultSetData, getData = defaultGetData} = props.config.dataHandlers || {}

  React.useEffect(() => {
    if (isSavedData) {
      const items = getData();
      if (items.length) {
        cardsModel.setMessageId((items.at(-1).messageId / 2) + 1);
        setCards(items);
      }
    }
  }, []);

  React.useEffect(() => {
    cardsModel.setUrl(props.config.url);
  }, [props.config.url]);

  React.useEffect(() => {
    cardsModel.setUserId(props.config.userId);
  }, [props.config.userId]);

  React.useEffect(() => {
    cardsModel.setParser(props.config.reqestParser);
  }, [props.config.reqestParser]);

  const toggleHandler = () => {
    setPopupVisible(!popupVisible);
  };

  const sendHandler = (value: string) => {
    if (value.trim()) {
      const newCards = cardsModel.addUserText(cards, value);
      setCards(newCards);
      setData(newCards);

      cardsModel.send(value).then((res) => {
        const newCards = cardsModel.addBotText(cards, res);
        setCards(newCards);
        setData(newCards);
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

  let classes = 'UMBot_themes-' + theme;
  if (detection.isWindows) {
    classes += ' is-windows';
  }
  if (detection.isMobile) {
    classes += ' is-mobile';
  }
  if (detection.isMac) {
    classes += ' is-mac';
  }
  if (props.className) {
    classes += ` ${props.className}`;
  }

  return (
    <div className={`UChat ${classes}`}>
      <Button
        forwardedRef={buttonRef}
        onClick={toggleHandler} 
        size={buttonSize}
        icon={buttonIcon}
        viewMode={buttonViewMode} 
        caption={buttonCaption}
        style={buttonStyle}/>
      <Popup visible={popupVisible} width={350} height={500} target={buttonRef.current}>
        <Panel
          caption={props.panelTitle}
          footerTemplate={<InputBlock onSend={sendHandler} isVoiceControl={isVoiceControl}/>}
          onClose={toggleHandler}>
            <CardsList cards={cards} onSend={sendCardHandlet} />
        </Panel>
      </Popup>
    </div>
  );
}
