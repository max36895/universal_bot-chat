import {ReactElement, useRef, useEffect, RefObject} from "react";
import Button from "./Button";
import Card from "./Card";
import {ICardButton, ICards} from "../interfaces/ICards";
import "./cardsList.css";

interface ICardsListProps {
    /**
     * Массив карточек
     */
    cards?: ICards[];
    /**
     * Событие обработки действия
     * @param value
     * @returns
     */
    onSend?: (value: ICardButton) => void;
}

/**
 * Компонент список карточек
 * @param props
 * @returns ReactElement
 */
const CardsList = (props: ICardsListProps): ReactElement => {
    const scrollRef = useRef<HTMLDivElement>();
    const {cards = []} = props;
    let buttons: ICardButton[] | undefined;
    if (cards.length) {
        buttons = cards[cards.length - 1].buttons;
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = Math.max(scrollRef.current.scrollHeight - scrollRef.current.clientHeight, 0);
        }
    }, [props.cards]);

    return (
        <div className="CardsList">
            <div className="CardsList_wrapper" ref={scrollRef as RefObject<HTMLDivElement>}>
                {cards.map((card) => {
                    return (
                        <Card key={card.messageId}
                              text={card.text}
                              date={card.date}
                              style={card.isBot ? 'bot' : 'user'}
                              type={card.cardType}
                              image={card.image}
                              list={card.list}
                              onSend={(value) => {
                                  props.onSend?.(value)
                              }}/>
                    );
                })}
            </div>
            {buttons && (
                <div className="CardsList_buttons-block">
                    <div className="CardsList_buttons-block_wrapper">
                        {buttons.map((button, index) => {
                            return (
                                <Button
                                    key={index}
                                    className="flex-shrink-0"
                                    style="secondary"
                                    caption={button.title}
                                    onClick={() => {
                                        props.onSend?.(button);
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CardsList;
