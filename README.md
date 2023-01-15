# umchat
umchat for run Alise skills or other voice assistants on the website

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
        url: '...', // webhook for skill,
        userId: 'local_test'
    };
    return <UMChat config={config}
                   panelTitle="skill name"
                   className="UMChat_absolute"/>
}
```
Run project
```bash
npm start
```

## Generate userId
To get the userId, you can use the standard generation method, or use your own solution.
```tsx
import {getUserId, IAppConfig} from "umchat";

function MyComponent() {
    const config: IAppConfig = {
        url: '...', // webhook for skill,
        userId: getUserId()
    };
    return <UMChat config={config}/>
}
```
You can pass an argument to the method that takes a boolean value. When passing the value true, the userId is recreated on each page opening, and all data is cleared from the storage. You should not pass this argument in a release application.

## Theme
For the component, you can set up themes, for this, pass the "theme" option to the component, with the name of your theme.

And also define a class in which new values for css variables will be specified
```css
.UMChat_themes-@{your_theme} {
    --panel_width: inherit; /* panel width */
    --panel_height: inherit; /* panel height */
    --panel_header_bg: #002D6D; /* panel heading background */
    --panel_header_height: 50px; /* panel heading height */

    --text_color: #333; /* default text color */
    --contrast_text_color: #fff; /* contrast text color */
    --unaccented_text_color: #aaa; /* unaccented text color */
    --link_text_color: #0260E8; /* link text color */
    --link_hover_text_color: #0351C1; /* hover link text color */
    --link_active_text_color: #0043A4; /* active link text color */

    --font-family: sans-serif; /* default font family */
    --font-size-s: 10px; /* small font size */
    --font-size-m: 14px; /* default font size */
    --font-size-mt: 18px; /* long font size */
    --font-size-l: 20px; /* header font size */

    --padding-s: 4px; /* very small pdding */
    --padding-st: 6px; /* small padding */
    --padding-m: 8px; /* default padding */
    --padding-mt: 10px; /* long padding */
    --padding-l: 12px; /* very long padding */

    --border-radius-xs: 2px; /* very small border radius */
    --border-radius-s: 4px; /* small border radius */
    --border-radius-m: 6px; /* default border radius */
    --border-radius-l: 8px; /* long border radius */

    --inline-height-s: 18px; /* small line height */
    --inline-height-m: 24px; /* default line height */
    --inline-height-l: 40px; /* long line height */

    --scrollbar_size: 5px; /* scrollbar size */

    --bg: #FFF; /* default background */
    --danger_bg: #BC0022; /* error background */
    --unaccented_bg: #f8f8f8; /* unaccented background */
    --unaccented_hover_bg: #eff0f4; /* hover unaccented background */
    --unaccented_active_bg: #e7e9ec; /* active unaccented background */
    --unaccented_border_color: #D4DADE; /* unaccented border color */
    --unaccented_active_border_color: #8f99a3; /* active unaccented border color */
    --primary_bg: #f6733c; /* primary background */
    --primary_hover_bg: #e4662f; /* hover primary background */
    --primary_active_bg: #d6551f; /* active primary background */
    --primary_same_hover_bg: #e4662f25; /* hover primary same background */
    --primary_same_active_bg: #d6551f40; /* active primary same background */
    --secondary_bg: #265fa1; /* secondary background */
    --secondary_hover_bg: #2b5688; /* hover secondary background */
    --secondary_active_bg: #274c77; /* active secondary background */
    --secondary_same_hover_bg: #2b568825; /* hover secondary same background */
    --secondary_same_active_bg: #274c7740; /* active secondary same background */
    --translucent_dark_bg: rgba(255, 255, 255, .15); /* close button background */
    --translucent_hover_dark_bg: rgba(255, 255, 255, .25); /* hover close button background */
    --translucent_active_dark_bg: rgba(255, 255, 255, .35); /* active close button background */
    --border_color: #8C8C8C; /* border color */

    --user_msg_bg: #E5F0FF; /* user message background */
    --bot_msg_bg: #580BE4; /* bot message background */
}
```

## Demo
- [git](https://github.com/max36895/umchat_demo)
- [codesandbox](https://codesandbox.io/s/github/max36895/umchat_demo)
