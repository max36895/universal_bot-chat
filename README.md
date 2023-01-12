# universal_bot-chat
Universal chat for run Alise skills or other voice assistants on the website

## Run
Install dependencies 
```bash
npm i umchat
```
To start a chat, use the UChat component, passing the options necessary for the correct operation
```tsx
import {UMChat, IAppConfig} from 'umchat';
function MyComponent() {
    const config: IAppConfig = {
        url: '...'
    }
    return <UMChat config={config} className="UMChat_absolute"/>
}
```
Run project
```bash
npm start
```

## demo
- [git](https://github.com/max36895/umchat_demo)
- [codesandbox](https://codesandbox.io/s/github/max36895/universal_bot-chat)