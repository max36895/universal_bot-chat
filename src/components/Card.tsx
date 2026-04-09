import { ReactElement, CSSProperties, memo } from "react";
import { ICardButton, IImage, IList, TCardType } from "../interfaces/ICards";
import { getDate } from "../utils/date";
import "./card.css";

interface ICardProps {
    /**
     * Тип карточки
     * @default text
     */
    type?: TCardType;
    /**
     * Текст внутри карточки
     */
    text: string;
    /**
     * Дата создания карточки
     */
    date?: number;
    /**
     * Данные для отображения в виде карточки(type=card)
     */
    image?: IImage;
    /**
     * Данные для отображения в виде списка(type=list)
     */
    list?: IList;
    /**
     * Стиль карточки. Влияет на расположение карточки
     */
    style?: "bot" | "user";
    /**
     * Событие обработки определенного действия
     * @param value
     * @returns
     */
    onSend?: (value: ICardButton) => void;
}

function CardTypeText(props: ICardProps): ReactElement {
    return (
        <div className={`um-Card um-Card_type-${props.type} um-Card_style-${props.style}`}>
            <span className="um-Card_text-title um-Card_text">{props.text}</span>
            <time className="um-Card_text-date">{getDate(props.date)}</time>
        </div>
    );
}

function CardTypeCard(props: ICardProps): ReactElement {
    if (props.image) {
        const style: CSSProperties = { backgroundImage: props.image.src };
        return (
            <div className={`um-Card um-Card_type-card ${props.image.button ? "um-clickable" : ""}`}>
                <div className="um-Card_big-image um-Card_image" style={style} />
                <div className="um-Card_card-info">
                    <p className="um-Card_card-title um-Card_text">{props.image.title}</p>
                    <p className="um-Card_card-description um-Card_text">{props.image.description}</p>
                </div>
            </div>
        );
    }
    return <CardTypeText type="text" style={props.style} text={props.text} date={props.date} />;
}

function CardTypeList(props: ICardProps): ReactElement {
    if (props.list) {
        return (
            <div className="um-Card um-Card_type-list">
                <p className="um-Card_list-title um-Card_text">{props.list.title}</p>
                <div className="um-Card_list-items">
                    {props.list.images.map((image, index) => {
                        const style: CSSProperties = { backgroundImage: image.src };
                        return (
                            <div
                                className={`um-Card_list-item ${image.button ? "um-clickable" : ""}`}
                                onClick={() => {
                                    if (image.button && props.onSend) {
                                        props.onSend(image.button);
                                    }
                                }}
                                key={index}
                            >
                                <div className="um-Card_list-item-image um-Card_image" style={style} />
                                <div className="um-Card_list-item-info">
                                    <p className="um-Card_list-item-title um-Card_text">{image.title}</p>
                                    <p className="um-Card_list-item-description um-Card_text">{image.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {props.list.footer && (
                    <div
                        className="um-Card_list-footer"
                        onClick={() => {
                            if (props.list?.footer?.button && props.onSend) {
                                props.onSend(props.list.footer.button);
                            }
                        }}
                    >
                        {props.list.footer.text}
                    </div>
                )}
            </div>
        );
    } else {
        return <CardTypeText type="text" style={props.style} text={props.text} date={props.date} />;
    }
}

/**
 * Компонент карточка
 * @param props
 * @returns
 */
const Card = (props: ICardProps): ReactElement => {
    const { type = "text" } = props;
    if (type === "list") {
        return <CardTypeList {...props} />;
    }
    if (type === "card") {
        return <CardTypeCard {...props} />;
    }
    return <CardTypeText {...props} />;
};

export default memo(Card);
