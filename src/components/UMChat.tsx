import {ReactElement, useState, useRef, useEffect, useCallback, LegacyRef, memo} from "react";
import Button, {TButtonSize, TButtonViewMode, TButtonStyle} from "./Button";
import Panel from "./Panel";
import Popup from "./Popup";
import InputBlock from "./InputBlock";
import CardsList from "./CardsList";
import {ICardButton, ICards} from "../interfaces/ICards";
import CardsModel, {IRequestParser} from "../api/CardsModel";
import detection from "../utils/detection";
import {setCardsData as defaultSetData, getCardsData as defaultGetData} from "../utils/storage";
import Voice from "../api/Voice";
import "./umChat.css";

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
     * Url адрес, на который будет отправляться запрос пользователя
     */
    url: string;
    /**
     * Уникальный идентификатор пользователя
     */
    userId?: string;
    /**
     * Параметры для обработки запроса. По умолчанию используется стандартный обработчик.
     */
    requestParser?: IRequestParser;
    /**
     * Параметры для сохранения данных. По умолчанию используется стандартный обработчик.
     */
    dataHandlers?: IDataHandlers<ICards[]>;
}

interface IUMChatProps {
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
     * Иконка отображаемая в кнопке.
     * По умолчанию используется svg иконка.
     * Важно! При передаче строки, должен быть проинициализирован класс с переданным текстом ``` buttonIcon="icon-send"```, ``` .icon-send::before { content: ''; }```
     */
    buttonIcon?: string | ReactElement;
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
     * Произвольное содержимое кнопки
     */
    buttonContent?: ReactElement;
    /**
     * Заголовок раскрывающейся панели
     */
    panelTitle?: string;
    /**
     * Режим позволяющий взаимодействовать с панелью через голосовой интерфейс
     * @default true
     */
    isVoiceControl?: boolean;
    /**
     * Режим сохранения данных
     * @default true
     */
    isSavedData?: boolean;
    /**
     * Размеры раскрывающейся панели
     */
    panelSize?: {
        /**
         * Ширина раскрывающейся панели
         * @default 350
         */
        width?: number;
        /**
         * Высота раскрывающейся панели
         * default 500
         */
        height?: number;
    }
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

const ICON_MESSAGE = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path
        d="M8.5 12.5C8.5 12.5 9.8125 14 12 14C14.1875 14 15.5 12.5 15.5 12.5M14.75 7.5H14.76M9.25 7.5H9.26M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18ZM15.25 7.5C15.25 7.77614 15.0261 8 14.75 8C14.4739 8 14.25 7.77614 14.25 7.5C14.25 7.22386 14.4739 7 14.75 7C15.0261 7 15.25 7.22386 15.25 7.5ZM9.75 7.5C9.75 7.77614 9.52614 8 9.25 8C8.97386 8 8.75 7.77614 8.75 7.5C8.75 7.22386 8.97386 7 9.25 7C9.52614 7 9.75 7.22386 9.75 7.5Z"
        stroke="var(--text_color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

function getItems(isSavedData: boolean, getData: () => ICards[]): ICards[] | undefined {
    if (isSavedData) {
        const items = getData();
        if (items.length) {
            return items;
        }
    }
    return;
}

/**
 * Компонент, позволяющий открывать окно-чат с ботом, а также обрабатывать команды пользователя, и при необходимости сохранять.
 * Компонент работает в режиме запрос ответ, не подписываясь на возможность получения дополнительных ответов. 1 запрос, 1 ответ
 * @param props Параметры компонента
 * @returns ReactElement
 */
const UMChat = (props: IUMChatProps): ReactElement => {
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [readOnly, setReadOnly] = useState<boolean>(false);
    const [voice] = useState<Voice>(() => (new Voice()));
    const buttonRef = useRef<HTMLButtonElement>();
    const {
        buttonIcon = ICON_MESSAGE,
        buttonSize = 'l',
        isVoiceControl = true,
        isSavedData = true,
        theme = 'default',
        buttonViewMode,
        buttonStyle,
        buttonCaption
    } = props;
    const {setData = defaultSetData, getData = defaultGetData} = props.config.dataHandlers || {}
    const [cardsModel] = useState<CardsModel>(() => (new CardsModel(
        props.config.url,
        props.config.userId || '',
        props.config.requestParser,
        getItems(isSavedData, getData)
    )));
    const {width: panelWidth = 350, height: panelHeight = 500} = props.panelSize || {}

    useEffect(() => {
        cardsModel.setUrl(props.config.url);
    }, [props.config.url]);

    useEffect(() => {
        cardsModel.setUserId(props.config.userId);
    }, [props.config.userId]);

    useEffect(() => {
        cardsModel.setParser(props.config.requestParser);
    }, [props.config.requestParser]);

    const toggleHandler = () => {
        setPopupVisible(!popupVisible);
    };

    const sendHandler = useCallback((value: string) => {
        if (value.trim()) {
            const newCards = cardsModel.addUserText(value);
            setLoading(true);
            cardsModel.setCards(newCards);
            setData(newCards);
            let timeout = window.setTimeout(() => {
                setReadOnly(true);
                timeout = 0;
            }, 1000);

            cardsModel.send(value).then((res) => {
                const newCards = cardsModel.addBotText(res);
                if (timeout) {
                    clearTimeout(timeout);
                }
                setReadOnly(false);
                setLoading(false);
                cardsModel.setCards(newCards);
                setData(newCards);
                if (isVoiceControl) {
                    const text = cardsModel.getTTS(res);
                    if (text) {
                        voice.speak(text);
                    }
                }
            });
        }
    }, []);

    const sendCardHandler = useCallback((value: ICardButton): void => {
        voice.speakStop();
        if (value.url) {
            window.open(value.url, '_blank');
        } else {
            sendHandler(value.title);
        }
    }, []);

    let classes = 'UMChat UMChat_themes-' + theme;
    if (detection.isWindows) {
        classes += ' um-is-windows';
    }
    if (detection.isMobile) {
        classes += ' um-is-mobile';
    } else {
        classes += ' um-is-hovered';
    }
    if (detection.isMac) {
        classes += ' um-is-mac';
    }
    if (props.className) {
        classes += ` ${props.className}`;
    }

    return (
        <div className={`${classes}`}>
            <Button
                forwardedRef={buttonRef as LegacyRef<HTMLButtonElement>}
                onClick={toggleHandler}
                size={buttonSize}
                icon={buttonIcon}
                viewMode={buttonViewMode}
                caption={buttonCaption}
                children={props.buttonContent}
                style={buttonStyle}/>
            <Popup opened={popupVisible}
                   width={panelWidth}
                   height={panelHeight}
                   target={buttonRef.current}>
                <Panel
                    caption={props.panelTitle}
                    footerTemplate={<InputBlock onSend={sendHandler}
                                                isVoiceControl={isVoiceControl}
                                                autofocus={true}
                                                readOnly={readOnly}/>}
                    onClose={toggleHandler}>
                    <CardsList cards={cardsModel.getCards()}
                               loading={loading}
                               onSend={sendCardHandler}/>
                </Panel>
            </Popup>
        </div>
    );
}

export default memo(UMChat);
