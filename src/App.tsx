import "./styles.css";
import Button from "./components/Button";
import Panel from "./components/Panel";
import PanelButton from "./components/PanelButton";

export default function App() {
  const onClick = (value: string) => {
    console.log(value);
  };
  /*return (
    <div className="App">
      <Button viewMode="filled" caption="" icon="icon_smile" />
      <Panel caption="test" onSend={onClick} />
    </div>
  );*/
  return (
    <div className="App">
      <PanelButton />
    </div>
  );
}
