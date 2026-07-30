import axios from 'axios';
import { BASE_URL, BEARER_TOKEN } from '../constants/constants';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (BEARER_TOKEN) {
            config.headers.Authorization = `Bearer ${BEARER_TOKEN}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
