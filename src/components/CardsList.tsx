import React from "react";
import Button from "./Button";
import Card from "./Card";
import {ICardButton, ICards} from "../interfaces/ICards";
import "./cardsList.css";

interface ICardsListrops {
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
 * @returns React.ReactElement
 */
export default function CardsList(props: ICardsListrops): React.ReactElement {
  const scrollRef = React.useRef<HTMLDivElement>();
  const { cards = [] } = props;
  let buttons: ICardButton[];
  if (cards.length) {
    buttons = cards[cards.length - 1].buttons;
  }

  React.useEffect(() => {
    const el = scrollRef.current as HTMLDivElement;
    const scrollTop = Math.max(el.scrollHeight - el.clientHeight, 0);
    el.scrollTop = scrollTop;
  }, [props.cards]);

  return (
    <div className="CardsList">
      <div className="CardsList_wrapper" ref={scrollRef}>
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
