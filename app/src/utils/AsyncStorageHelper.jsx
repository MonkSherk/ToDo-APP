import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeTasks = async (tasks) => {
    try {
        await AsyncStorage.setItem('TASKS_KEY', JSON.stringify(tasks));
    } catch (error) {
        console.error('Ошибка сохранения задач в AsyncStorage', error);
    }
};

export const getTasksFromStorage = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('TASKS_KEY');
        return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error('Ошибка чтения задач из AsyncStorage', error);
        return [];
    }
};
