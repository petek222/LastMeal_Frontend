import axios from 'axios';

const api = axios.create({
    baseURL: 'http://54.237.232.9:5000/v1',
    timeout: 10000,
});

export default api;