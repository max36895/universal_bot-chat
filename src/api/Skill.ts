import IMessage from "../interfaces/IMessage";
import Request, { IRequestSend } from "./Request";

interface IButton {
  title: string;
  hide: boolean;
}

export interface ISkillResponse {
  response: {
    text: string;
    tts: string;
    buttons: IButton[];
  };
}

interface ITextConfig {
  text: string;
  isBot?: boolean;
  buttons?: string[];
}

const URL =
  "https://www.islandgift.ru/yandex/endpoint/6c79447e-0013-437f-a4cd-277ec5583fd9/alisa/index";
let count = 0;

export default class Skill {
  protected _req: Request;
  constructor() {
    this._req = new Request();
  }

  send(value: string): Promise<IRequestSend<ISkillResponse>> {
    this._req.post = {
      meta: {
        locale: "ru-Ru",
        timezone: "UTC",
        client_id: "local",
        interfaces: {
          screen: {},
          payments: null,
          account_linking: null
        }
      },
      session: {
        message_id: count,
        session_id: "local",
        skill_id: "local_test",
        user_id: "test",
        new: count === 0
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
    count++;
    return this._req.send<ISkillResponse>(URL);
  }

  private _getDate(): string {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
  }

  private _addText(data: IMessage[], config: ITextConfig): IMessage[] {
    data.push({
      text: config.text.trim(),
      date: this._getDate(),
      isBot: config.isBot || false,
      buttons: config.buttons
    });
    return data;
  }

  addUserText(data: IMessage[], value: string): IMessage[] {
    return [...this._addText(data, { text: value })];
  }

  addBotText(
    data: IMessage[],
    response: IRequestSend<ISkillResponse>
  ): IMessage[] {
    if (response.status) {
      const res = response.data?.response;
      if (res) {
        let buttons: string[] | undefined;
        if (res.buttons) {
          const btns = res.buttons;
          btns.forEach((btn) => {
            if (btn.hide) {
              if (!buttons) {
                buttons = [];
              }
              buttons.push(btn.title);
            }
          });
        }
        const text = res.text || "";
        return [...this._addText(data, { text, isBot: true, buttons })];
      }
    }
    return data;
  }

  getTTS(response: IRequestSend<ISkillResponse>): string {
    if (response.status) {
      return response.data?.response.tts || response.data?.response.text || "";
    }
    return "";
  }
}
