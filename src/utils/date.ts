function getShortDate(date: Date): string {
    return `${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '')}${date.getMinutes()}`;
}

function getLongDate(date: Date): string {
    const day = date.getDate();
    const month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
    return `${day}.${month}`;
}

function getFullDate(date: Date): string {
    return `${getLongDate(date)}.${date.getFullYear()}`;
}

/**
 * Getting the date as a string, depending on the current date
 * @param date
 */
function getDate(date?: number): string {
    if (date) {
        const currentDate = new Date();
        const argDate = new Date(date);
        if (currentDate.getDay() === argDate.getDay() &&
            currentDate.getMonth() === argDate.getMonth() &&
            currentDate.getFullYear() === argDate.getFullYear()) {
            return getShortDate(argDate);
        } else if (currentDate.getFullYear() === argDate.getFullYear()) {
            return getLongDate(argDate);
        }
        return getFullDate(argDate);
    }
    return '';
}

export {getDate};