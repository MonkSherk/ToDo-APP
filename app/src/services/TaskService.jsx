import apiClient from '../api';
import {getToken} from "@/app/src/services/SecureStorage";

const createTask = async ({ title, description }, page = 1, limit = 15) => {
    try {
        const token = await getToken();
        console.log('Token:', token);
        if (!token) {
            throw new Error('Токен отсутствует.');
        }

        const params = new URLSearchParams({ page, limit });
        console.log('Отправка запроса на сервер:', { title, description, page, limit });

        const response = await apiClient.post(
            `/tasks/?${params.toString()}`,
            { title, description },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        console.log('Ответ от сервера:', response.data);
        return response.data;
    } catch (error) {
        console.error('Ошибка в createTask:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const getTasks = async (page = 1, limit = 15) => {
    try {
        const params = new URLSearchParams({ page, limit });
        const response = await apiClient.get(`/tasks?${params.toString()}`);
        console.log('Ответ при получении задач:', response.data);
        return response.data;
    } catch (error) {
        console.error('Ошибка в getTasks:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const getTasksByDate = async (date, page = 1, limit = 15) => {
    try {
        const params = new URLSearchParams({ page, limit });
        const response = await apiClient.get(`/tasks/${date}?${params.toString()}`);
        console.log('Ответ при получении задач по дате:', response.data);
        return response.data;
    } catch (error) {
        console.error('Ошибка в getTasksByDate:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const markTaskDone = async (id, page = 1, limit = 15) => {
    try {
        const params = new URLSearchParams({ page, limit });
        const response = await apiClient.patch(`/tasks/done/${id}?${params.toString()}`, {});
        console.log('Ответ при пометке задачи как выполненной:', response.data);
        return response.data;
    } catch (error) {
        console.error('Ошибка в markTaskDone:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const updateTask = async (id, { title, description }, page = 1, limit = 15) => {
    try {
        const params = new URLSearchParams({ page, limit });
        const response = await apiClient.put(
            `/tasks/${id}?${params.toString()}`,
            { title, description }
        );
        console.log('Ответ при обновлении задачи:', response.data);
        return response.data;
    } catch (error) {
        console.error('Ошибка в updateTask:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const deleteTask = async (id, page = 1, limit = 15) => {
    try {
        const params = new URLSearchParams({ page, limit });
        const response = await apiClient.delete(`/tasks/${id}?${params.toString()}`);
        console.log('Ответ при удалении задачи:', response.data);
        return response.data;
    } catch (error) {
        console.error('Ошибка в deleteTask:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export default {
    createTask,
    getTasks,
    getTasksByDate,
    markTaskDone,
    updateTask,
    deleteTask,
};
