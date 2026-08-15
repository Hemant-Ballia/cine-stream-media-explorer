import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_KEY;

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    accept: 'application/json',
  },
});

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.status_message || error.message);
  }
};

export const searchMovies = async (query, page = 1) => {
  if (!query?.trim()) return { results: [], total_pages: 0 };

  try {
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.status_message || error.message);
  }
};

export default tmdbApi;