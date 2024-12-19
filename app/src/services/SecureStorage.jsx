import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'userToken';

export const saveToken = async (token) => {
    try {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
        console.error('Ошибка сохранения токена', error);
    }
};

export const getToken = async () => {
    try {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
        console.error('Ошибка чтения токена', error);
        return null;
    }
};

export const deleteToken = async () => {
    try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
        console.error('Ошибка удаления токена', error);
    }
};
