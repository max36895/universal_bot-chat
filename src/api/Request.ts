// @ts-expect-error
import { Request as BaseRequest, AppContext } from 'umbot';

const appContext = new AppContext();
appContext.setLogger({
    error: () => {},
    warn: () => {},
    maskSecrets: false,
});
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
export default class Request extends BaseRequest {
    /**
     * Request constructor.
     */
    public constructor() {
        super(appContext);
        this.url = null;
        this.post = null;
        this.maxTimeQuery = 5000;
    }

    /**
     * Отправка запроса.
     * Возвращаем массив. В случае успеха свойство 'status' = true.
     *
     * @param {string} url Адрес, на который отправляется запрос.
     * @return Promise<IRequestSend>
     * @api
     */
    public async send<T>(url: string | null = null): Promise<IRequestSend<T>> {
        return super.send(url);
    }
}
