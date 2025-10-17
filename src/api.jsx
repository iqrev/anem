// api.jsx
import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4";

// Ambil 24 anime aman untuk semua umur
export const getAnimeList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/anime?sfw=true`);
    return response.data;
  } catch (error) {
    console.error("Error fetching anime list:", error);
    return [];
  }
};

// top anime 
export const getAnimeTop = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/top/anime?limit=24`);
    return response.data;
  } catch (error) {
    return [];
  }
};

// Cari anime di seluruh database (bukan hanya top)
export const searchAnime = async (query) => {
  const anime = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}&sfw=true&order_by=popularity&sort=asc`);
  return anime;
};
