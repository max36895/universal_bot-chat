/**
 * Отправка запросов
 * @module
 */
export interface IRequestSend<T> {
  /**
   * Статус ответа. True, если запрос успешно выполнился, иначе false.
   */
  status: boolean;
  /**
   * Полученные данные.
   */
  data: T | null;
  /**
   * Ошибка при отправке запроса.
   */
  err?: string;
}

/**
 * Класс отвечающий за отправку curl запросов на необходимый url.
 * Поддерживаются различные заголовки, а также присутствует возможность отправки файлов.
 *
 * @class Request
 */
export default class Request {
  public static readonly HEADER_FORM_DATA: Record<string, string> = {
    "Content-Type": "multipart/form-data"
  };
  public static readonly HEADER_AP_JSON: Record<string, string> = {
    "Content-Type": "application/json"
  };

  /**
   * Адрес, на который отправляется запрос.
   */
  public url: string | null;
  /**
   * Post параметры запроса.
   */
  public post: any;
  /**
   * Отправляемые заголовки.
   */
  public header: HeadersInit | null;
  /**
   * Максимально время, за которое должен быть получен ответ. В мсек.
   */
  public maxTimeQuery: number | null;
  /**
   * Формат ответа.
   * True, если полученный ответ нужно преобразовать как json. По умолчанию true.
   */
  public isConvertJson: boolean;

  /**
   * Ошибки при выполнении запроса.
   */
  private _error: string | null;

  /**
   * Request constructor.
   */
  public constructor() {
    this.url = null;
    this.post = null;
    this.header = null;
    this.maxTimeQuery = null;
    this.isConvertJson = true;
    this._error = null;
  }

  /**
   * Отправка запроса.
   * Возвращаем массив. В случае успеха свойство 'status' = true.
   *
   * @param {string} url Адрес, на который отправляется запрос.
   * @return Promise<IRequestSend>
   * [
   *  - bool status Статус выполнения запроса.
   *  - mixed data Данные полученные при выполнении запроса.
   * ]
   * @api
   */
  public async send<T>(url: string | null = null): Promise<IRequestSend<T>> {
    if (url) {
      this.url = url;
    }

    this._error = null;
    const data: any = await this._run();
    if (this._error) {
      return { status: false, data: null, err: this._error };
    }
    return { status: true, data };
  }

  /**
   * Начинаем отправку fetch запроса.
   * В случае успеха возвращаем содержимое запроса, в противном случае null.
   *
   * @return Promise<any>
   */
  private async _run<T>(): Promise<T | string | null> {
    if (this.url) {
      const response = await fetch(this.url, this._getOptions());
      if (response.ok) {
        if (this.isConvertJson) {
          return await response.json();
        }
        return await response.text();
      }
      this._error = "Не удалось получить данные с " + this.url;
    } else {
      this._error = "Не указан url!";
    }
    return null;
  }

  /**
   * Получение корректного  параметра для отправки запроса.
   * @return RequestInit
   * @private
   */
  protected _getOptions(): RequestInit | undefined {
    const options: RequestInit = {};

    if (this.maxTimeQuery) {
      const controller = new AbortController();
      const signal: AbortSignal = controller.signal;
      setTimeout(() => controller.abort(), this.maxTimeQuery);
      options.signal = signal;
    }

    if (this.post) {
      options.method = "POST";
      options.body = JSON.stringify(this.post);
    }

    if (this.header) {
      options.headers = this.header;
    }
    return options;
  }

  /**
   * Возвращает текст с ошибкой, произошедшей при выполнении запроса.
   *
   * @return string
   * @api
   */
  public getError(): string | null {
    return this._error;
  }
}
