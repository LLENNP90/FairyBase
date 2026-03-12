import axios from 'axios';

const FLASK_API = 'http://localhost:5000';
const JIKAN_API = 'https://api.jikan.moe/v4';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    // console.log(token);
    if (token && token !== 'undefined' && token !== 'null') {
        return { Authorization: `Bearer ${token}` };
    }
    
    // Return an empty object if no valid token exists
    return {};
};

export const api = {
    //  get from jikan api 
    getTopAnime: async () => {
        const response = await axios.get(`${JIKAN_API}/top/anime`);
        return response.data.data;
    },

    searchAnime: async (query) => {
        const response = await axios.get(`${JIKAN_API}/anime`, {
            params: { q: query }
        });
        return response.data.data;
    },

    getAnimeDetails: async (id) => {
        const response = await axios.get(`${FLASK_API}/anime/${id}`, {headers: getAuthHeader()});
        return response.data;
    },

    // get from flask api

    // getFavourites: async () => {
    //     const response = await axios.get(`${FLASK_API}/favourites`);
    //     return response.data;
    // },

    // getWatchlist: async () => {
    //     const response = await axios.get(`${FLASK_API}/watchlist`);
    //     return response.data;
    // },

    getMyList: async (status) => {
        try {
            const params = status ? { status } : {};
            const response = await axios.get(`${FLASK_API}/mylist`, {
                params,
                headers: getAuthHeader() 
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching list:', error);
            return [];
        }
    },


    addToList: async (animeData) => {
        try{
            const response = await axios.post(
                `${FLASK_API}/add_favourite`, 
                animeData, 
                {headers: getAuthHeader()});
            return response.data;
        } catch (error) {
            console.error('Error adding to list:', error);
        }

    },

    removeFromList: async (id) => {
        try {
            const response = await axios.delete(
                `${FLASK_API}/remove/${id}`,
                { headers: getAuthHeader() }  // ← Send token here!
            );
            return response.data;
        } catch (error) {
            console.error('Error removing from list:', error);
        }
    },

    moveToFav: async (id) => {
        try{
            const response = await axios.put(
                `${FLASK_API}/move/${id}`,
                {},
                {headers: getAuthHeader()}
            );
            return response.data;
        } catch (error) {
            console.error('Error moving from list:', error);
        }

    },
    getProfileStats: async () => {
        try{
            const response = await axios.get(
                `${FLASK_API}/profile`,
                {headers: getAuthHeader()}
            );
            // console.log(response.data)
            return response.data;
        }
        catch(error){
            console.log(error)
        }
    }
};