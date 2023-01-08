export interface ICardButton {
  title: string;
  url?: string;
}

export interface IFooter {
  text: string;
  button?: ICardButton;
}

export interface IImage {
  title: string;
  description?: string;
  src: string;
  button?: ICardButton;
}

export interface IList {
  title?: string;
  images: IImage[];
  footer?: IFooter;
}

export type TCardType = 'text' | 'card' | 'list' | 'error';

export interface ICards {
  messageId: number;
  text: string;
  date: number;
  cardType?: TCardType;
  image?: IImage;
  list?: IList;
  isBot: boolean;
  buttons?: ICardButton[] | null | undefined;
}
