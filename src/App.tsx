import "./styles.css";
import UChat from "./components/UChat";

export default function App() {
  return (
    <div className="App">
      <UChat botUrl="https://www.islandgift.ru/yandex/endpoint/6c79447e-0013-437f-a4cd-277ec5583fd9/snowball/index"
        isVoiceControl={true}
        panelTitle="Игра в снежки"/>
    </div>
  );
}
