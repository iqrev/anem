import { useEffect, useState } from "react";
import "./App.css";
import { getAnimeList, getAnimeTop, searchAnime } from "./api";
import { Link } from "react-router-dom";

const App = () => {
  const [animes, setAnimes] = useState([]);
  const [filteredAnimes, setFilteredAnimes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Ambil 24 anime awal
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAnimeTop();
        const animeData = result?.data?.data ?? result?.data ?? [];
        setAnimes(animeData);
        setFilteredAnimes(animeData);
      } catch (error) {
        console.error("Error fetching anime list:", error);
        setAnimes([]);
        setFilteredAnimes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //  Search ke API Jikan
  const handleSearch = async (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredAnimes(animes);
      return;
    }

    try {
      setLoading(true);
      const result = await searchAnime(query);
      const animeData = result?.data?.data ?? [];
      setFilteredAnimes(animeData);
    } catch (err) {
      console.error("searchAnime error:", err);
      setFilteredAnimes([]);
    } finally {
      setLoading(false);
    }
  };

  const AnimeList = () => {
    if (loading) return <div className="text-gray-500 text-center mt-6">Loading...</div>;
    if (filteredAnimes.length === 0)
      return <div className="text-red-500 text-center mt-6"></div>;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-6">
        {filteredAnimes.map((anime, i) => {
          const title =
            anime?.title ?? anime?.title_english ?? anime?.title_japanese ?? `#${anime?.mal_id ?? i}`;
          const imageUrl =
            anime?.images?.jpg?.image_url ??
            "https://via.placeholder.com/300x400?text=No+Image";
          const genres = anime?.genres?.map((g) => g.name).join(", ") ?? "Unknown";

          return (
            <div
              key={anime?.mal_id ?? i}
              className="relative max-w-sm bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-80 object-cover"
              />

              <div className="absolute top-2 left-2 bg-black/60 text-white text-sm font-bold px-2 py-1 rounded-md">
                {anime?.rank ? `#${anime.rank}` : "No Rank"}
              </div>

              <div className="p-4 flex flex-col justify-between h-56">
                <div>
                  <h2 className="text-md font-semibold text-gray-900 mb-2 truncate">
                    {title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{genres}</p>
                  <div className="text-center text-sm text-gray-500 mb-3">
                    {anime?.year ?? "Unknown Year"}
                  </div>
                </div>

                {anime?.trailer?.embed_url ? (
                  <div className="text-center">
                    <a
                      href={anime.trailer.embed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-white/20 border border-white/30 backdrop-blur-md text-black text-sm font-medium py-2 px-4 rounded-lg shadow-lg hover:bg-white/30 hover:backdrop-blur-lg hover:shadow-xl transition-all duration-300 w-full"
                    >
                      🎬 Lihat trailer
                    </a>
                  </div>
                ) : (
                  <div className="py-2 px-4 text-center text-gray-400 text-sm italic">
                    Tidak ada trailer
                  </div>
                )}
              </div>
            </div>

          );
        })}
      </div>
    );
  };

  return (
    <div className="App min-h-screen bg-gray-50 text-gray-800">
      <link rel="icon" type="image" href="./anem-icon.svg" />
      <header className="py-6 text-center">

        <img
          src="src/assets/anem.svg"
          alt="Anem Logo"
          className="w-full max-w-xs mx-auto mb-4 py-2"
        />

        {/* 🔍 Search bar */}
        <div className="w-full max-w-md mx-auto mt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Cari Anemu..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div className="container mx-auto px-4">
          <h1 className="text-left pt-4 text-3xl font-bold text-gray-900">
            {searchQuery ? "Hasil Pencarian" : "Anem Teratas"}
          </h1>
          <AnimeList />
        </div>
      </header>
      <footer className="text-center py-6 mt-10 border-t border-gray-200 text-sm text-gray-500">
        &copy; 2025 Anem. Made with ❤️ for anime fans.
      </footer>
    </div>
  );
};

export default App;
