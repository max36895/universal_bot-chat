const HOUR = 3600;
const DAY = HOUR * 24;

function getShortDate(date: Date): string {
    return `${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '')}${date.getMinutes()}`;
}

function getLongDate(date: Date): string {
    const day = date.getDay() + 1;
    const month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
    return `${day}.${month}`;
}

function getFullDate(date: Date): string {
    return `${getLongDate(date)}.${date.getFullYear()}`;
}

function getDate(date: number): string {
    const curentDate = new Date();
    const argDate = new Date(date);
    if (curentDate.getDay() === argDate.getDay() &&
        curentDate.getMonth() === argDate.getMonth() &&
        curentDate.getFullYear() === argDate.getFullYear()) {
            return getShortDate(argDate);
    } else if (curentDate.getFullYear() === argDate.getFullYear()) {
        return getLongDate(argDate);
    }
    return getFullDate(argDate);
}

export {getDate};