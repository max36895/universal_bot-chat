import {ICards} from "../interfaces/ICards";

const KEY = 'um-chat_cards';
const LIMIT = 100;

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
    let correctCards = cards;
    if (correctCards.length > LIMIT) {
        correctCards = correctCards.slice(correctCards.length - LIMIT);
    }
    localStorage.setItem(KEY, JSON.stringify(correctCards));
}

/**
 * Clear cards data
 */
function clearData(): void {
    localStorage.removeItem(KEY);
}

export {setData, getData, clearData};