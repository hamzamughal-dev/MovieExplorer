import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const BEARER_TOKEN = import.meta.env.VITE_HEADER;

const movieEndpoint = "/trending/movie/day";
const detailEndpoint = "/movie"
const favouriteEndpoint = "/account/";

export const getSessionIDApi = () => {
    return axios.get(`${BASE_URL}/authentication/guest_session/new`, {
        params: {
            api_key: API_KEY,
        },
    });
}

export const getAccountDetails = async () => {
    const response = await axios.get(`${BASE_URL}/account`, {
        headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            'Content-Type': 'application/json',
        },
    })
    return response.data;
}
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

const addToFavouritesApi = (accID, movieID, favorite = true) => {
    return axios.post(
        `${BASE_URL}/account/${accID}/favorite`,
        {
            media_id: Number(movieID),
            media_type: "movie",
            favorite,
        },
        {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json',
            },
        }
    );
}

const getFavouritesApi = (endpoint, params = {}) => {
    return axios.get(`${BASE_URL}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            'Content-Type': 'application/json',
        },
        params: {
            ...params,
        },
    });
};

export const getMovies = (page = 1) =>
    getMoviesApi(movieEndpoint, {
        language: "en-US",
        page,
    });

export const getDetails = (id) =>
    getDetailsApi(`${detailEndpoint}/${id}`, {
        language: "en-US",
    });

const getSearchedMovieApi = (endpoint, params = {}) => {
    return axios.get(`${BASE_URL}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            accept: "application/json",
        },
        params,
    });
};

export const searchMovies = (query, page = 1) =>
    getSearchedMovieApi("/search/movie", {
        query,
        include_adult: false,
        language: "en-US",
        page,
    });
export const getSessionID = () => getSessionIDApi();
export const addToFavourites = (accID, movieID) => addToFavouritesApi(accID, movieID, true);
export const removeFromFavourites = (accID, movieID) => addToFavouritesApi(accID, movieID, false);
export const getFavourites = (accID, page = 1) =>
    getFavouritesApi(`${favouriteEndpoint}${accID}/favorite/movies`, {
        language: "en-US",
        page,
    });
