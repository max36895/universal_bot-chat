interface IDetection {
    platform?: string;
    isMobile?: boolean;
    isWindows?: boolean;
    isMac?: boolean;
    isLinux?: boolean;
}

const detection: IDetection = {};

interface IUserAgentData {
    mobile?: boolean;
    platform?: string;
}

interface INavigator extends Navigator {
    userAgentData: IUserAgentData;
}

function init() {
    detection.isWindows = !!navigator.userAgent.match(/Windows/g);
    detection.isMac = !!navigator.userAgent.match(/Mac OS/g);
    detection.isLinux = !!navigator.userAgent.match(/Linux/g);
    // Лучше сделать проверку менее сложной. Так мы в любом случае поймем что устройство мобильное.
    // Сложность может возникнуть только с тем, что планшет может зайти как мобильное устройство.
    if ((navigator as INavigator).userAgentData) {
        detection.isMobile = (navigator as INavigator).userAgentData.mobile;
        detection.platform = (navigator as INavigator).userAgentData.platform;
    } else {
        detection.isMobile = !!navigator.userAgent.match(/Mobile/g);
        detection.platform = navigator.platform;
    }
}

init();

export default detection;