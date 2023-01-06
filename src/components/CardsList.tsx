import React from "react";
import Button from "./Button";
import Card from "./Card";
import {ICardButton, ICards} from "../interfaces/ICards";
import "./cardsList.css";

interface ICardsListrops {
  cards?: ICards[];
  onSend?: (value: ICardButton) => void;
}

export default function CardsList(props: ICardsListrops) {
  const scrollRef = React.useRef<HTMLDivElement>();
  const { cards = [] } = props;
  let buttons: ICardButton[];
  if (cards.length) {
    buttons = cards[cards.length - 1].buttons;
  }

  const isWindows = navigator.userAgent.match(/Windows/g);

  React.useEffect(() => {
    const el = scrollRef.current as HTMLDivElement;
    const scrollTop = Math.max(el.scrollHeight - el.clientHeight, 0);
    el.scrollTop = scrollTop;
  }, [props.cards]);

  return (
    <div className={`CardsList ${isWindows ? 'is-windows' : ''}`}>
      <div className="CardsList_wrapper" ref={scrollRef}>
        {cards.map((card, index) => {
          return (
            <Card key={index} 
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
