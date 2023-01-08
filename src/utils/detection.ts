
interface IDetection {
    platform?: string;
    isMobile?: boolean;
    isWindows?: boolean;
    isMac?: boolean;
}

const detection: IDetection = {};

function init() {
    detection.isWindows = !!navigator.userAgent.match(/Windows/g);
    detection.isMac = !!navigator.userAgent.match(/Mac OS/g);
    detection.isMobile = !!navigator.userAgent.match(/Mobile/g);
    detection.platform = navigator.platform;
}

init();

export default detection;