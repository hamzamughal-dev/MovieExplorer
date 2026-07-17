import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const getMoviesApi = (endpoint, params = {}) => {
    return axios.get(`${BASE_URL}${endpoint}`, {
        params: {
            api_key: API_KEY,
            ...params,
        },
    });
};

const getDetailsApi = (endpoint, params = {}) => {
    return axios.get(`${BASE_URL}${endpoint}`, {
        params: {
            api_key: API_KEY,
            ...params,
        },
    });
};

export const getMovies = () =>
    getMoviesApi("/trending/movie/day", {
        language: "en-US",
    });

export const getDetails = (id) =>
    getDetailsApi(`/movie/${id}`, {
        language: "en-US",
    });