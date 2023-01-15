import {clearUserData, clearCardsData} from "./storage"

const KEY = 'um-chat_user-id';

function generateUserId(): string {
    const getHash = (rad: number = 1000): string => {
        return Math.floor(Math.random() * rad) + '';
    }
    return getHash(10e5) + '/' + Date.now() + getHash();
}

/**
 * Генерирует уникальный userId пользователя
 * @param isNew Создание нового userId каждый раз. Стоит использовать при dev разработке.
 */
function getUserId(isNew?: boolean): string {
    if (isNew) {
        localStorage.removeItem(KEY);
        clearUserData();
        clearCardsData();
    }
    let userId = localStorage.getItem(KEY);
    if (!userId) {
        userId = generateUserId();
        localStorage.setItem(KEY, userId);
    }
    return userId;
}

export {
    getUserId
};