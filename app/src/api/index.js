import axios from 'axios';
const API_BASE_URL = 'https://test.ai-softdev.com';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 100000,
});


export default apiClient;
