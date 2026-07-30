import axiosInstance from './axiosInstance';
import { API_KEY } from '../constants/constants';

const ENDPOINTS = {
    AUTH: {
        SESSION: `/authentication/session/new`,
        ACCOUNT_DETAILS: `/account`,
        REQUEST_TOKEN: `/authentication/token/new`,
        LOGIN: `/authentication/token/validate_with_login`,
    },
    MOVIES: {
        TRENDING: `/trending/movie/day`,
        DETAILS: (id) => `/movie/${id}`,
        FAVORITE: (accID) => `/account/${accID}/favorite`,
        FAVORITE_MOVIES: (accID) => `/account/${accID}/favorite/movies`,
    },
    SEARCH: {
        SEARCH: `/search/movie`,
    }
};

export const getRequestToken = () => {
    return axiosInstance.get(ENDPOINTS.AUTH.REQUEST_TOKEN);
};

export const getLoginDetails = (username, password, request_token) => {
    return axiosInstance.post(ENDPOINTS.AUTH.LOGIN, {
        username,
        password,
        request_token,
    });
};

export const getSessionID = (requestTokenValue) => {
    return axiosInstance.post(ENDPOINTS.AUTH.SESSION, {
        request_token: requestTokenValue,
    });
};

export const getAccountDetails = async (sessionID) => {
    const response = await axiosInstance.get(ENDPOINTS.AUTH.ACCOUNT_DETAILS, {
        params: {
            session_id: sessionID,
        },
    });
    return response.data;
};

export const getMovies = (page = 1) => {
    return axiosInstance.get(ENDPOINTS.MOVIES.TRENDING, {
        params: {
            language: "en-US",
            page,
        },
    });
};

export const getDetails = (id) => {
    return axiosInstance.get(ENDPOINTS.MOVIES.DETAILS(id), {
        params: {
            language: "en-US",
        },
    });
};

export const addToFavourites = (accID, movieID, sessionID) => {
    return axiosInstance.post(
        ENDPOINTS.MOVIES.FAVORITE(accID),
        {
            media_id: Number(movieID),
            media_type: "movie",
            favorite: true,
        },
        {
            params: {
                session_id: sessionID,
            }
        }
    );
};

export const removeFromFavourites = (accID, movieID, sessionID) => {
    return axiosInstance.post(
        ENDPOINTS.MOVIES.FAVORITE(accID),
        {
            media_id: Number(movieID),
            media_type: "movie",
            favorite: false,
        },
        {
            params: {
                session_id: sessionID,
            }
        }
    );
};

export const getFavourites = (accID, sessionID, page = 1) => {
    return axiosInstance.get(ENDPOINTS.MOVIES.FAVORITE_MOVIES(accID), {
        params: {
            language: "en-US",
            page,
            session_id: sessionID,
        },
    });
};

export const searchMovies = (query, page = 1) => {
    return axiosInstance.get(ENDPOINTS.SEARCH.SEARCH, {
        params: {
            query,
            include_adult: false,
            language: "en-US",
            page,
        },
    });
};
