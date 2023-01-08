# universal_bot-chat
Universal chat for run Alise scills or other voice assistants on the web site

## Run
Install dependencies 
```bash
npm i
```
Run project
```bash
npm start
```

## Using
To start a chat, use the UChat component, passing the options necessary for the correct operation
```tsx
import UChat, {IAppConfig} from './components/UChat';
function MyComponent() {
    const config: IAppConfig = {
        url: '...'
    }
    return <UChat config={config} className="UChat_absolute"/>
}

```


## demo
[codesandbox](https://codesandbox.io/s/github/max36895/universal_bot-chat)