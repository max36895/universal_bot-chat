import { ICards } from "../interfaces/ICards";

const KEY = "um-chat_cards";
const KEY_DATA = "um-chat_data";
const LIMIT = 100;

function setUserData(data?: object): void {
    if (data) {
        localStorage.setItem(KEY_DATA, JSON.stringify(data));
    } else {
        clearCardsData();
    }
}

function getUserData(): object {
    const data = localStorage.getItem(KEY_DATA);
    if (data) {
        return JSON.parse(data);
    }
    return {};
}

function clearUserData(): void {
    localStorage.removeItem(KEY_DATA);
}

/**
 * Return saved cards data
 * @returns ICards
 */
function getCardsData(): ICards[] {
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
function setCardsData(cards: ICards[]): void {
    let correctCards = cards;
    if (correctCards.length > LIMIT) {
        correctCards = correctCards.slice(correctCards.length - LIMIT);
    }
    localStorage.setItem(KEY, JSON.stringify(correctCards));
}

/**
 * Clear cards data
 */
function clearCardsData(): void {
    localStorage.removeItem(KEY);
}

export { setCardsData, getCardsData, clearCardsData, setUserData, getUserData, clearUserData };
