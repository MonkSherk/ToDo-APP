import apiClient from '../api';

const register = async (email, password) => {
    const response = await apiClient.post('/auth/register', { email, password });
    return response.data;
};

const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
};

const logout = async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
};

const getCurrentUser = async (token) => {
    const response = await apiClient.get('/auth/current-user', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const changePassword = async (token, newPassword) => {
    const response = await apiClient.post('/auth/change-password',
        { new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

const updateUser = async (token, formData) => {
    const response = await apiClient.patch('/auth/user', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export default {
    register,
    login,
    logout,
    getCurrentUser,
    changePassword,
    updateUser,
};
