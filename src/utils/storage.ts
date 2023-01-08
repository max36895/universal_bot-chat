import { ICards } from "../interfaces/ICards";

const KEY = 'um-chat_cards';

/**
 * Return saved cards data
 * @returns ICards
 */
function getData(): ICards[] {
    const item = localStorage.getItem(KEY);
    if (item) {
        return JSON.parse(item);
    }
    return [];
}

/**
 * Save cards data
 * @param cards cards data
 */
function setData(cards: ICards[]): void {
    localStorage.setItem(KEY, JSON.stringify(cards));
}

function clearData(): void {
    localStorage.removeItem(KEY);
}

export {setData, getData, clearData};