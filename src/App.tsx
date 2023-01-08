import "./styles.css";
import UChat, {IAppConfig} from "./components/UChat";

export default function App() {
  const config: IAppConfig = {
    url: 'https://www.islandgift.ru/yandex/endpoint/6c79447e-0013-437f-a4cd-277ec5583fd9/snowball/index'
  };
  return (
    <div className="App">
      <UChat config={config}
        isVoiceControl={true}
        panelTitle="Игра в снежки"/>
    </div>
  );
}
