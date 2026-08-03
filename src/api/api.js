import axiosInstance from './axiosInstance';
import { API_KEY } from '../constants/constants';

const ENDPOINTS = {
    AUTH: {
        SESSION: `/authentication/session/new`,
        ACCOUNT_DETAILS: `/account`,
        REQUEST_TOKEN: `/authentication/token/new`,
        LOGIN: `/authentication/token/validate_with_login`,
    },
    HOME: {
        TRENDING_ALL: `/trending/all/day`,
        POPULAR_MOVIES: `/movie/popular`,
        POPULAR_TV: `/tv/popular`,
        TOP_RATED_MOVIES: `/movie/top_rated`,
        TOP_RATED_TV: `/tv/top_rated`,
        UPCOMING_MOVIES: `/movie/upcoming`,
    },
    MOVIES: {
        TRENDING: `/trending/movie/day`,
        DETAILS: (id) => `/movie/${id}`,
        FAVORITE: (accID) => `/account/${accID}/favorite`,
        FAVORITE_MOVIES: (accID) => `/account/${accID}/favorite/movies`,
    },
    TV:{
        TRENDING: "/trending/tv/day",
        DETAILS: (id) => `/tv/${id}`,
        FAVORITE: (accID) => `/account/${accID}/favorite`,
        FAVORITE_TV: (accID) => `/account/${accID}/favorite/tv`,
    },
    SEARCH: {
        SEARCH_MOVIE: `/search/movie`,
        SEARCH_TV: `/search/tv`,
        SEARCH_MULTI: `/search/multi`,
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

export const getTvShows = (page = 1) => {
    return axiosInstance.get(ENDPOINTS.TV.TRENDING, {
        params: {
            language: "en-US",
            page,
        },
    });
};

export const getDetails = (id, type) => {
    if (type === "movie") {
        return axiosInstance.get(ENDPOINTS.MOVIES.DETAILS(id), {
            params: {
                language: "en-US",
            },
        });
    } else if (type === "tv") {
        return axiosInstance.get(ENDPOINTS.TV.DETAILS(id), {
            params: {
                language: "en-US",
            },
        });
    }
};

export const addToFavourites = (accID, mediaID, sessionID, mediaType = "movie") => {
    return axiosInstance.post(
        ENDPOINTS.MOVIES.FAVORITE(accID),
        {
            media_id: Number(mediaID),
            media_type: mediaType,
            favorite: true,
        },
        {
            params: {
                session_id: sessionID,
            }
        }
    );
};

export const removeFromFavourites = (accID, mediaID, sessionID, mediaType = "movie") => {
    return axiosInstance.post(
        ENDPOINTS.MOVIES.FAVORITE(accID),
        {
            media_id: Number(mediaID),
            media_type: mediaType, 
            favorite: false,
        },
        {
            params: {
                session_id: sessionID,
            }
        }
    );
};

export const getFavourites = (accID, sessionID, type = "movie", page = 1) => {
    const endpoint = type === "tv" 
        ? ENDPOINTS.TV.FAVORITE_TV(accID) 
        : ENDPOINTS.MOVIES.FAVORITE_MOVIES(accID);

    return axiosInstance.get(endpoint, {
        params: {
            language: "en-US",
            page,
            session_id: sessionID,
        },
    });
};

export const searchMedia = (query, page = 1, type = "multi") => {
    let endpoint = ENDPOINTS.SEARCH.SEARCH_MULTI;
    if (type === "movie") endpoint = ENDPOINTS.SEARCH.SEARCH_MOVIE;
    if (type === "tv") endpoint = ENDPOINTS.SEARCH.SEARCH_TV;

    return axiosInstance.get(endpoint, {
        params: {
            query,
            include_adult: false,
            language: "en-US",
            page,
        },
    });
};

export const searchMovies = (query, page = 1) => searchMedia(query, page, "movie");

export const getTrendingAll = (page = 1) => {
    return axiosInstance.get(ENDPOINTS.HOME.TRENDING_ALL, {
        params: { language: "en-US", page },
    });
};

export const getPopularMovies = (page = 1) => {
    return axiosInstance.get(ENDPOINTS.HOME.POPULAR_MOVIES, {
        params: { language: "en-US", page },
    });
};

export const getPopularTvShows = (page = 1) => {
    return axiosInstance.get(ENDPOINTS.HOME.POPULAR_TV, {
        params: { language: "en-US", page },
    });
};

export const getTopRatedMovies = (page = 1) => {
    return axiosInstance.get(ENDPOINTS.HOME.TOP_RATED_MOVIES, {
        params: { language: "en-US", page },
    });
};

export const getTopRatedTvShows = (page = 1) => {
    return axiosInstance.get(ENDPOINTS.HOME.TOP_RATED_TV, {
        params: { language: "en-US", page },
    });
};
