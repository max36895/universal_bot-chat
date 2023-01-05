import React from "react";
import Button from "./Button";
import Panel from "./Panel";
import InputBlock from "./InputBlock";
import Message from "./Message";
import IMessage from "../interfaces/IMessage";
import Skill from "../api/Skill";
import "./panelButton.css";
import Voice from "../api/Voice";

export default function PanelButton(props) {
  const [panelVisible, setPanelVisible] = React.useState(false);
  const [buttonVisible, setButtonVisible] = React.useState(true);
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [skill] = React.useState(new Skill());
  const [voice] = React.useState(new Voice());

  const toggleHandler = () => {
    setPanelVisible(!panelVisible);
    if (panelVisible) {
      setTimeout(() => {
        setButtonVisible(!buttonVisible);
      }, 850);
    } else {
      setButtonVisible(!buttonVisible);
    }
  };

  const sendHandler = (value: string) => {
    if (value.trim()) {
      setMessages(skill.addUserText(messages, value));

      skill.send(value).then((res) => {
        setMessages(skill.addBotText(messages, res));
        const text = skill.getTTS(res);
        if (text) {
          voice.speak(text);
        }
      });
    }
  };

  const footerTemplate = <InputBlock onSend={sendHandler} />;

  return (
    <div className={`PanelButton ${panelVisible ? "PanelButton_visible" : ""}`}>
      {buttonVisible ? (
        <Button onClick={toggleHandler} size="l" icon="icon-info" />
      ) : (
        <Panel
          caption="Верю не верю"
          footerTemplate={footerTemplate}
          onClose={toggleHandler}
          onSend={sendHandler}
        >
          <Message messages={messages} onSend={sendHandler} />
        </Panel>
      )}
    </div>
  );
}
