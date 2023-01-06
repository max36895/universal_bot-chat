import {ICardButton, ICards, IImage, IList, TCardType} from "../interfaces/ICards";
import Request, { IRequestSend } from "./Request";

interface IButton {
  title: string;
  text?: string;
  hide: boolean;
  url?: string;
}

interface IItem {
  title?: string;
  description?: string;
  image_id?: string;
  button?: IButton;
}

export interface ICardsModelResponse {
  response: {
    text: string;
    tts: string;
    buttons: IButton[];
    card?: {
      type: 'BigImage' | 'ItemsList';
      image_id?: string;
      title?: string;
      description?: string;
      button?: IButton;

      header?: {
        text: string;
      }
      items?: IItem[];
      footer?: {
        text: string;
        button: IButton;
      } 
    }
  };
};

export interface IRequestParser {
  sendRequest: (value: string, messageId: number, user_id?: string) => object;
  parsePesponse: (res: unknown) => ICardsModelResponse;
  getImage: (imageId: string, size?: string) => string;
};

interface ITextConfig {
  text: string;
  image?: IImage;
  list?: IList;
  isBot?: boolean;
  type?: TCardType;
  buttons?: ICardButton[];
}

let count = 0;

export default class CardsModel {
  protected _req: Request;
  protected _botUrl: string;
  protected _parser: IRequestParser;
  protected _userId: string;

  constructor(url?: string, userId?: string, parser?: IRequestParser) {
    this._req = new Request();
    this.setUrl(url);
    this.setUserId(userId);
    this.setParser(parser);
  }

  setParser(parser: IRequestParser): void {
    if (parser) {
      this._parser = parser;
    } else {
      this._parser = {
        sendRequest: this.getDefaultSend,
        getImage: this._getImage,
        parsePesponse(res) {
          return res as ICardsModelResponse;
        }
      }
    }
  }

  setUserId(userId: string): void {
    this._userId = userId;
  }

  setUrl(url: string) {
    this._botUrl = url;
  }

  private getDefaultSend(value: string, messageId: number, userId: string = 'test'): object {
    return {
      meta: {
        locale: "ru-Ru",
        timezone: "UTC",
        client_id: "web-site",
        interfaces: {
          screen: {},
          payments: null,
          account_linking: null
        }
      },
      session: {
        message_id: messageId,
        session_id: "web-site",
        skill_id: "web-site_id",
        user_id: userId,
        new: messageId === 0
      },
      request: {
        command: value.toLowerCase(),
        original_utterance: value,
        nlu: {},
        type: "SimpleUtterance"
      },
      state: {
        session: {}
      },
      version: "1.0"
    };
  }

  send(value: string): Promise<IRequestSend<ICardsModelResponse>> {
    if (!this._botUrl) {
      return Promise.reject('Please added bot url address');
    }
    this._req.post = this._parser.sendRequest(value, count, this._userId);
    count++;
    return this._req.send<ICardsModelResponse>(this._botUrl);
  }

  private _getDate(): string {
    const date = new Date();
    return `${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '')}${date.getMinutes()}`;
  }

  private _getImage(token: string, size: string = 'one-x3'): string {
    if (token) {
      return `https://avatars.mds.yandex.net/get-dialogs-skill-card/${token}/${size}`;
    }
    return '';
  }

  private _getButton(button: IButton): ICardButton {
    if (button) {
      return {
        title: button.text || button.title,
        url: button.url
      };
    }
  }

  private _addCard(cards: ICards[], config: ITextConfig): ICards[] {
    cards.push({
      text: config.text.trim(),
      date: this._getDate(),
      isBot: config.isBot || false,
      cardType: config.type || 'text',
      image: config.image,
      list: config.list,
      buttons: config.buttons
    });
    return cards;
  }

  addUserText(cards: ICards[], value: string): ICards[] {
    return [...this._addCard(cards, { text: value })];
  }

  addBotText(
    cards: ICards[],
    response: IRequestSend<ICardsModelResponse>
  ): ICards[] {
    if (response.status) {
      const res = this._parser.parsePesponse(response.data)?.response;
      if (res) {
        let buttons: ICardButton[] | undefined;
        if (res.buttons) {
          const btns = res.buttons;
          btns.forEach((btn) => {
            if (btn.hide) {
              if (!buttons) {
                buttons = [];
              }
              buttons.push(this._getButton(btn));
            }
          });
        }
        const text = res.text || "";
        const config: ITextConfig = { text, isBot: true, buttons };
        if (res.card) {
          if (res.card.type === 'BigImage') {
            config.type = 'card';
            config.image = {
              src: `url("${this._parser.getImage(res.card.image_id)}")`,
              title: res.card.title,
              description: res.card.description
            };
            if (res.card.button) {
              config.image.button = this._getButton(res.card.button);
            }
          } else {
            const images: IImage[] = [];
            res.card.items.forEach((item) => {
              images.push(
                {
                  src: `url("${this._parser.getImage(item.image_id, 'menu-list-x3')}")`,
                  title: item.title,
                  description: item.description,
                  button: this._getButton(item.button)
                }
              );
            });
            config.type = 'list';
            config.list = {
              title: res.card.header?.text,
              images
            };
            if (res.card.footer) {
              config.list.footer = {
                text: res.card.footer.text,
                button: this._getButton(res.card.footer.button)
              };
            }
          }
        }
        return [...this._addCard(cards, config)];
      }
    }
    return cards;
  }

  getTTS(response: IRequestSend<ICardsModelResponse>): string {
    if (response.status) {
      // Пока есть сложности с синтезом речи. Поэтому читаем просто текст как сможем
      // todo придумать потом что-то
      const tts = /* response.data?.response.tts || */response.data?.response.text || "";
      // remove all smile
      return tts.replace(/[^\x00-\x7Fа-яА-Я]/g, '');
    }
    return "";
  }
}
