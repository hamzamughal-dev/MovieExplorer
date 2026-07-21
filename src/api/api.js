import axios from 'axios';
import { BASE_URL, API_KEY, BEARER_TOKEN } from '../utils/constants';

export const getSessionID = () => {
    return axios.get(`${BASE_URL}/authentication/guest_session/new`, {
        params: {
            api_key: API_KEY,
        },
    });
};

export const getAccountDetails = async () => {
    const response = await axios.get(`${BASE_URL}/account`, {
        headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

export const getMovies = (page = 1) => {
    return axios.get(`${BASE_URL}/trending/movie/day`, {
        params: {
            api_key: API_KEY,
            language: "en-US",
            page,
        },
    });
};

export const getDetails = (id) => {
    return axios.get(`${BASE_URL}/movie/${id}`, {
        params: {
            api_key: API_KEY,
            language: "en-US",
        },
    });
};

export const addToFavourites = (accID, movieID) => {
    return axios.post(
        `${BASE_URL}/account/${accID}/favorite`,
        {
            media_id: Number(movieID),
            media_type: "movie",
            favorite: true,
        },
        {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json',
            },
        }
    );
};

export const removeFromFavourites = (accID, movieID) => {
    return axios.post(
        `${BASE_URL}/account/${accID}/favorite`,
        {
            media_id: Number(movieID),
            media_type: "movie",
            favorite: false,
        },
        {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json',
            },
        }
    );
};

export const getFavourites = (accID, page = 1) => {
    return axios.get(`${BASE_URL}/account/${accID}/favorite/movies`, {
        headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            'Content-Type': 'application/json',
        },
        params: {
            language: "en-US",
            page,
        },
    });
};

export const searchMovies = (query, page = 1) => {
    return axios.get(`${BASE_URL}/search/movie`, {
        headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            accept: "application/json",
        },
        params: {
            query,
            include_adult: false,
            language: "en-US",
            page,
        },
    });
};
