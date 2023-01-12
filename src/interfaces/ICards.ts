export interface ICardButton {
    /**
     * Заголовок кнопки
     */
    title: string;
    /**
     * Ссылка, на которую необходимо осуществить переход
     */
    url?: string;
}

export interface IFooter {
    /**
     * Текст, отображаемый в самом низу карточки
     */
    text: string;
    /**
     * Если передано, то превращает переданный текст в кнопку
     */
    button?: ICardButton;
}

export interface IImage {
    /**
     * Заголовок для изображения
     */
    title?: string;
    /**
     * Описание для изображения
     */
    description?: string;
    /**
     * Путь до изображения
     */
    src: string;
    /**
     * Превращает изображение в кнопку
     */
    button?: ICardButton;
}

export interface IList {
    /**
     * Заголовок карточки
     */
    title?: string;
    /**
     * Список отображаемых элементов
     */
    images: IImage[];
    /**
     * Содержимое находящееся вниз карточки
     */
    footer?: IFooter;
}

export type TCardType = 'text' | 'card' | 'list' | 'error';

export interface ICards {
    /**
     * Порядковый номер сообщения
     */
    messageId: number;
    /**
     * Текст сообщения
     */
    text: string;
    /**
     * Дата создания сообщения
     */
    date: number;
    /**
     * Определяет тип карточки
     */
    cardType?: TCardType;
    /**
     * Отображаемое изображение. Актуально когда cardType установлен в card
     */
    image?: IImage;
    /**
     * Отображаемый список. Актуально когда cardType установлен в list
     */
    list?: IList;
    /**
     * Определяет отправителя сообщения
     */
    isBot: boolean;
    /**
     * Массив кнопок
     */
    buttons?: ICardButton[] | undefined;
}
