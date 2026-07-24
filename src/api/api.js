import axios from 'axios';
import { BASE_URL, API_KEY, BEARER_TOKEN } from '../utils/constants';

const ENDPOINTS = {
    GUEST_SESSION: `${BASE_URL}/authentication/guest_session/new`,
    ACCOUNT_DETAILS: `${BASE_URL}/account`,
    TRENDING_MOVIES: `${BASE_URL}/trending/movie/day`,
    MOVIE_DETAILS: (id) => `${BASE_URL}/movie/${id}`,
    FAVORITE: (accID) => `${BASE_URL}/account/${accID}/favorite`,
    FAVORITE_MOVIES: (accID) => `${BASE_URL}/account/${accID}/favorite/movies`,
    SEARCH_MOVIES: `${BASE_URL}/search/movie`,
};

export const getSessionID = () => {
    return axios.get(ENDPOINTS.GUEST_SESSION, {
        params: {
            api_key: API_KEY,
        },
    });
};

export const getAccountDetails = async () => {
    const response = await axios.get(ENDPOINTS.ACCOUNT_DETAILS, {
        headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

export const getMovies = (page = 1) => {
    return axios.get(ENDPOINTS.TRENDING_MOVIES, {
        params: {
            api_key: API_KEY,
            language: "en-US",
            page,
        },
    });
};

export const getDetails = (id) => {
    return axios.get(ENDPOINTS.MOVIE_DETAILS(id), {
        params: {
            api_key: API_KEY,
            language: "en-US",
        },
    });
};

export const addToFavourites = (accID, movieID) => {
    return axios.post(
        ENDPOINTS.FAVORITE(accID),
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
        ENDPOINTS.FAVORITE(accID),
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
    return axios.get(ENDPOINTS.FAVORITE_MOVIES(accID), {
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
    return axios.get(ENDPOINTS.SEARCH_MOVIES, {
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
