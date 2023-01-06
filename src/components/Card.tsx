import React from "react";
import { ICardButton, IImage, IList, TCardType } from "../interfaces/ICards";
import "./card.css";

interface ICardProps {
    type?: TCardType;
    text: string;
    date?: string;
    image?: IImage;
    list?: IList;
    style?: 'bot' | 'user';
    onSend?: (value: ICardButton) => void;
}

function getTypeText(props: ICardProps): React.ReactElement {
    return (<div className={`Card Card_type-text Card_style-${props.style}`}>
        <span className="Card_text-title Card_text">{props.text}</span>
        <time className="Card_text-date">{props.date}</time>
      </div>);
}

function getTypeCard(props:ICardProps): React.ReactElement {
    const style: React.CSSProperties = {backgroundImage: props.image.src};
    return <div className={`Card Card_type-card ${props.image.button ? 'clicable' : ''}`}>
        <div className="Card_big-image Card_image" style={style}/>
        <div className="Card_card-info">
            <p className="Card_card-title Card_text">{props.image.title}</p>
            <p className="Card_card-description Card_text">{props.image.description}</p>
        </div>
    </div>;
}


function getTypeList(props:ICardProps): React.ReactElement {
    return <div className="Card Card_type-list">
        <p className="Card_list-title Card_text">{props.list.title}</p>
        <div className="Card_list-items">
            {
                props.list.images.map((image, index) => {
                    const style: React.CSSProperties = {backgroundImage: image.src};
                    return <div className={`Card_list-item ${image.button ? 'clicable' : ''}`} onClick={() => {
                                if (image.button && props.onSend) {
                                    props.onSend(image.button);
                                }
                            }} key={index}>
                        <div className="Card_list-item-image Card_image" style={style}/>
                        <div className="Card_list-item-info">
                            <p className="Card_list-item-title Card_text">{image.title}</p>
                            <p className="Card_list-item-description Card_text">{image.description}</p>
                        </div>
                    </div>;
                })
            }
        </div>
        {
            props.list.footer && (
                <div className="Card_list-footer" onClick={() => {
                    if (props.list.footer.button && props.onSend) {
                        props.onSend(props.list.footer.button);
                    }
                }}>{props.list.footer.text}</div>
            )
        }
    </div>;
}

export default function Card(props: ICardProps) {
    const {type = 'text'} = props;

    return (
    <>
        {
            (type === 'text') ? getTypeText(props) : (
                type === 'card' ? getTypeCard(props) : getTypeList(props)
            )
        }
    </>
    );
}