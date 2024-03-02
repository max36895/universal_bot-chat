import { ICardButton, ICards, IImage, IList, TCardType } from "../interfaces/ICards";
import Request, { IRequestSend } from "./Request";
import { getUserData, setUserData } from "../utils/storage";

/**
 * Интерфейс кнопки.
 * Кнопки позволяют выполнять определенные действия. Если указан url, то будет открыта ссылка, иначе будет отправлен запрос на сервер с текстом.
 */
interface IButton {
    /**
     * Текст кнопки
     */
    title: string;
    /**
     * Текст кнопки. Передается в карточку
     */
    text?: string;
    /**
     * Режим отображения кнопки. Для отображения кнопки нужно передать true
     */
    hide: boolean;
    /**
     * Ссылка на страницу, на которую нужно осуществить переход при нажатии на кнопку.
     */
    url?: string;
}

interface IItem {
    /**
     * Заголовок
     */
    title?: string;
    /**
     * Описание
     */
    description?: string;
    /**
     * Идентификатор картинки
     */
    image_id?: string;
    /**
     * Кнопка
     */
    button?: IButton;
}

export interface ICardsModelResponse {
    response: {
        /**
         * Отображаемый текст
         */
        text: string;
        /**
         * Текст, который будет озвучен
         */
        tts: string;
        /**
         * Кнопки отображаемые для более удобной навигации
         */
        buttons: IButton[];
        /**
         * Данные для отображения карточки
         */
        card?: {
            /**
             * Режим отображения карточки. Картинка(BigImage) или список(ItemsList)
             */
            type: "BigImage" | "ItemsList";
            /**
             * Идентификатор картинки. Нужно указывать если установлен режим BigImage
             */
            image_id?: string;
            /**
             * Заголовок карточки. Нужно указывать если установлен режим BigImage
             */
            title?: string;
            /**
             * Описание карточки. Нужно указывать если установлен режим BigImage
             */
            description?: string;
            /**
             * Кнопка карточки. Нужно указывать если установлен режим BigImage
             */
            button?: IButton;

            /**
             * Данные для заголовка списка. Нужно указывать если установлен режим ItemsList
             */
            header?: {
                /**
                 * Текст заголовка списка
                 */
                text: string;
            };
            /**
             * Список отображаемых элементов. Нужно указывать если установлен режим ItemsList
             */
            items: IItem[];
            /**
             * Содержимое, отображаемое в самом низу списка. Нужно указывать если установлен режим ItemsList
             */
            footer?: {
                /**
                 * Отображаемый текст
                 */
                text: string;
                /**
                 * Кнопка
                 */
                button: IButton;
            };
        };
    };
    /**
     * Данные для сохранения в локальном хранилище
     */
    user_state_update?: object;
}

export interface IRequestParser {
    /**
     * Возвращает данные для отправки запроса на сервер
     * @param value Значение введенное пользователем
     * @param messageId Порядковый номер отправленного пользователем сообщения
     * @param user_id Идентификатор пользователя
     * @returns
     */
    sendRequest: (value: string, messageId: number, user_id?: string | number) => object;
    /**
     * Обработка полученного результата с сервера, для приведения его к корректному для работы виду
     * @param res
     * @returns
     */
    parseResponse: (res: unknown) => ICardsModelResponse;
    /**
     * Метод для получения ссылки на изображение
     * @param imageId
     * @param size
     * @returns
     */
    getImage: (imageId?: string, size?: string) => string;
}

interface ITextConfig {
    messageId: number;
    text: string;
    image?: IImage;
    list?: IList;
    isBot?: boolean;
    type?: TCardType;
    buttons?: ICardButton[];
}

let userMsgCount = 1;

export default class CardsModel {
    protected _req: Request;
    protected _botUrl: string;
    // @ts-ignore
    protected _parser: IRequestParser;
    protected _userId: string | number;
    protected _cards: ICards[] = [];

    constructor(url: string, userId: string | number, parser?: IRequestParser, cards?: ICards[]) {
        this._req = new Request();
        this._botUrl = url;
        this._userId = userId;
        this.setParser(parser);
        if (cards) {
            this.setCards(cards);
            this.setMessageId(cards[cards.length - 1].messageId / 2 + 1);
        }
    }

    setParser(parser: IRequestParser | undefined): void {
        if (parser) {
            this._parser = parser;
        } else {
            this._parser = {
                sendRequest: CardsModel.getDefaultSend,
                getImage: CardsModel._getImage,
                parseResponse(res) {
                    if ((res as ICardsModelResponse)?.user_state_update) {
                        setUserData((res as ICardsModelResponse).user_state_update);
                    }
                    return res as ICardsModelResponse;
                },
            };
        }
    }

    setUserId(userId?: string | number): void {
        if (userId) {
            this._userId = userId;
        } else {
            console.warn("CardModel.setUserId(): Incorrect userId");
        }
    }

    setUrl(url: string) {
        this._botUrl = url;
    }

    setMessageId(messageId: number): void {
        userMsgCount = messageId;
    }

    getTTS(response: IRequestSend<ICardsModelResponse>): string {
        if (response.status) {
            // Пока есть сложности с синтезом речи. Поэтому читаем просто текст как сможем,
            // или берем tts если нет text, и будь что будет
            // todo придумать потом что-то
            const tts = response.data?.response.text || response.data?.response.tts || "";
            // remove all smile
            return tts.replace(/[^\x00-\x7Fа-яА-Я]/g, "");
        }
        return "";
    }

    addUserText(value: string): ICards[] {
        return CardsModel._addCard(this._cards, { text: value, messageId: userMsgCount * 2 - 1 });
    }

    addBotText(response: IRequestSend<ICardsModelResponse>): ICards[] {
        if (response.status) {
            const res = this._parser.parseResponse(response.data)?.response;
            if (res) {
                let buttons: ICardButton[] | undefined;
                if (res.buttons) {
                    res.buttons.forEach((btn) => {
                        if (btn.hide) {
                            if (!buttons) {
                                buttons = [];
                            }
                            buttons.push(CardsModel._getButton(btn) as IButton);
                        }
                    });
                }
                const text = res.text || "";
                const config: ITextConfig = { text, isBot: true, buttons, messageId: (userMsgCount - 1) * 2 };
                if (res.card) {
                    if (res.card.type === "BigImage") {
                        config.type = "card";
                        config.image = {
                            src: `url("${this._parser.getImage(res.card.image_id)}")`,
                            title: res.card.title,
                            description: res.card.description,
                        };
                        if (res.card.button) {
                            config.image.button = CardsModel._getButton(res.card.button);
                        }
                    } else {
                        const images: IImage[] = [];
                        res.card.items.forEach((item) => {
                            images.push({
                                src: `url("${this._parser.getImage(item.image_id, "menu-list-x3")}")`,
                                title: item.title,
                                description: item.description,
                                button: CardsModel._getButton(item.button),
                            });
                        });
                        config.type = "list";
                        config.list = {
                            title: res.card.header?.text,
                            images,
                        };
                        if (res.card.footer) {
                            config.list.footer = {
                                text: res.card.footer.text,
                                button: CardsModel._getButton(res.card.footer.button),
                            };
                        }
                    }
                }
                return CardsModel._addCard(this._cards, config);
            }
        }
        const config: ITextConfig = {
            type: "error",
            text: "Произошла ошибка!\n" + response.err,
            isBot: true,
            messageId: (userMsgCount - 1) * 2,
        };
        return CardsModel._addCard(this._cards, config);
    }

    send(value: string): Promise<IRequestSend<ICardsModelResponse>> {
        if (!this._botUrl) {
            return Promise.reject("Please added bot url address");
        }
        this._req.post = this._parser.sendRequest(value, userMsgCount, this._userId);
        userMsgCount++;
        return this._req.send<ICardsModelResponse>(this._botUrl);
    }

    getCards(): ICards[] {
        return this._cards;
    }

    setCards(cards: ICards[]): void {
        this._cards = cards;
    }

    private static getDefaultSend(value: string, messageId: number, userId: string | number = "test"): object {
        return {
            meta: {
                locale: "ru-Ru",
                timezone: "UTC",
                client_id: "web-site",
                interfaces: {
                    screen: {},
                    payments: null,
                    account_linking: null,
                },
            },
            session: {
                message_id: messageId - 1,
                session_id: "web-site",
                skill_id: "web-site_id",
                user_id: userId,
                user: {
                    user_id: userId,
                },
                application: {
                    application_id: userId,
                },
                new: messageId === 1,
            },
            request: {
                command: value.toLowerCase(),
                original_utterance: value,
                nlu: {},
                type: "SimpleUtterance",
            },
            state: {
                session: {},
                user: getUserData(),
                application: {},
            },
            version: "1.0",
        };
    }

    private static _getButton(button?: IButton): ICardButton | undefined {
        if (button) {
            return {
                title: button.text || button.title,
                url: button.url,
            };
        }
    }

    private static _getImage(token?: string, size: string = "one-x3"): string {
        if (token) {
            return `https://avatars.mds.yandex.net/get-dialogs-skill-card/${token}/${size}`;
        }
        return "";
    }

    private static _addCard(cards: ICards[], config: ITextConfig): ICards[] {
        cards.push({
            text: config.text.trim(),
            date: Date.now(),
            messageId: config.messageId,
            isBot: config.isBot || false,
            cardType: config.type || "text",
            image: config.image,
            list: config.list,
            buttons: config.buttons,
        });
        return cards;
    }
}
