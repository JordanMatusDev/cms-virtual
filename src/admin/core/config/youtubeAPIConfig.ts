import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
export const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
export const YOUTUBE_API_ENDPOINTS = {
    PLAYLIST: '/playlists',
    PLAYLIST_ITEMS: '/playlistItems',
    VIDEOS: '/videos',
};

const youtubeApi = axios.create({
    baseURL: YOUTUBE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    params: {
        key: YOUTUBE_API_KEY,
    },
    timeout: 10000,
});

youtubeApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error(`[YouTube API Error ${error.response.status}]:`, error.response.data);
        }
        else if (error.request) {
            console.error('[YouTube API Error]: No response from server');
        }
        else {
            console.error('[YouTube API Error]:', error.message);
        }
        return Promise.reject(error);
    }
);
export default youtubeApi;