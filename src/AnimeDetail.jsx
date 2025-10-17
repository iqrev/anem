// src/pages/AnimeDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const AnimeDetail = () => {
  const { id } = useParams(); 
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
        setAnime(response.data.data);
      } catch (error) {
        console.error("Error fetching anime detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (!anime) return <div className="text-center mt-10 text-red-500">Anime not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{anime.title}</h1>
          <p className="text-gray-600 mb-4">{anime.synopsis}</p>

          <div className="text-sm text-gray-500 mb-4">
            <span className="mr-4">Episodes: {anime.episodes ?? "N/A"}</span>
            <span>Score: {anime.score ?? "N/A"}</span>
          </div>

          {anime.trailer?.embed_url && (
            <div className="mb-6">
              <iframe
                src={anime.trailer.embed_url}
                title="Trailer"
                className="w-full h-64 rounded-lg shadow"
                allowFullScreen
              />
            </div>
          )}

          <Link
            to="/"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
