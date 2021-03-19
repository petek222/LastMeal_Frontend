import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://54.237.232.9:80/v1',
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    let value = await AsyncStorage.getItem("token");
    if (value !== null) {
        config.headers['Authorization'] = `Bearer ${value}`;
    }
    console.log('Config');
    console.log(config);
    return config;
}, err => {
    console.log(err);
    return Promise.reject(error);
});

export default api;