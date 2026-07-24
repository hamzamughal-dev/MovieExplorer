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
    return axiosInstance.get(ENDPOINTS.AUTH.REQUEST_TOKEN, {
        params: {
            api_key: API_KEY,
        },
    });
};

export const getLoginDetails = (username, password, request_token) => {
    return axiosInstance.post(ENDPOINTS.AUTH.LOGIN, {
        username,
        password,
        request_token,
    }, {
        params: {
            api_key: API_KEY,
        },
    });
};

export const getSessionID = (requestTokenValue) => {
    return axiosInstance.post(ENDPOINTS.AUTH.SESSION, {
        request_token: requestTokenValue,
    }, {
        params: {
            api_key: API_KEY,
        },
    });
};

export const getAccountDetails = async (sessionID) => {
    const actualSessionId = typeof sessionID === 'object'
        ? (sessionID?.data?.session_id || sessionID?.session_id)
        : sessionID;

    const response = await axiosInstance.get(ENDPOINTS.AUTH.ACCOUNT_DETAILS, {
        params: {
            session_id: actualSessionId,
        },
    });
    return response.data;
};

export const getMovies = (page = 1) => {
    return axiosInstance.get(ENDPOINTS.MOVIES.TRENDING, {
        params: {
            api_key: API_KEY,
            language: "en-US",
            page,
        },
    });
};

export const getDetails = (id) => {
    return axiosInstance.get(ENDPOINTS.MOVIES.DETAILS(id), {
        params: {
            api_key: API_KEY,
            language: "en-US",
        },
    });
};

export const addToFavourites = (accID, movieID) => {
    return axiosInstance.post(
        ENDPOINTS.MOVIES.FAVORITE(accID),
        {
            media_id: Number(movieID),
            media_type: "movie",
            favorite: true,
        }
    );
};

export const removeFromFavourites = (accID, movieID) => {
    return axiosInstance.post(
        ENDPOINTS.MOVIES.FAVORITE(accID),
        {
            media_id: Number(movieID),
            media_type: "movie",
            favorite: false,
        }
    );
};

export const getFavourites = (accID, page = 1) => {
    return axiosInstance.get(ENDPOINTS.MOVIES.FAVORITE_MOVIES(accID), {
        params: {
            language: "en-US",
            page,
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
