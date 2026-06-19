import { useState } from "react";
import "./App.css";
import movieHeroIllustration from "./assets/movie_hero_illustration.png";
import aaveshamPoster from "./assets/aavesham.jpg";
import alvinPoster from "./assets/alvin.jpg";
import minnalMuraliPoster from "./assets/minnal_murali.jpg";
import padakkalamPoster from "./assets/padakkalam.jpg";
import vaazhaPoster from "./assets/vaazha.jpg";

// Premium preloaded movies using user's uploaded posters
const LOCAL_MOVIES = [
  {
    Title: "Aavesham",
    Year: "2024",
    Genre: "Action / Comedy",
    Runtime: "2h 38min",
    Rating: "9.8",
    Poster: aaveshamPoster,
    Plot: "Ranga, a quirky and eccentric gangster in Bangalore, takes a group of college students under his wing, leading to a series of hilarious yet action-packed events."
  },
  {
    Title: "Minnal Murali",
    Year: "2021",
    Genre: "Action / Sci-Fi",
    Runtime: "2h 38min",
    Rating: "9.7",
    Poster: minnalMuraliPoster,
    Plot: "A tailor gains superhero powers after being struck by lightning, but must also stop an unexpected nemesis who has gained similar abilities in his village."
  },
  {
    Title: "Vaazha",
    Year: "2024",
    Genre: "Comedy / Drama",
    Runtime: "2h 15min",
    Rating: "9.5",
    Poster: vaazhaPoster,
    Plot: "A hilarious and emotional journey of a group of boys navigating youth, social expectations, and personal growth in modern society."
  },
  {
    Title: "Alvin and the Chipmunks: The Road Chip",
    Year: "2015",
    Genre: "Animation / Family",
    Runtime: "1h 32min",
    Rating: "8.8",
    Poster: alvinPoster,
    Plot: "Through a series of misunderstandings, Alvin, Simon and Theodore come to believe that Dave is going to propose to his new girlfriend in Miami... and dump them."
  },
  {
    Title: "Padakkalam",
    Year: "2024",
    Genre: "Action / Drama",
    Runtime: "2h 10min",
    Rating: "9.0",
    Poster: padakkalamPoster,
    Plot: "An intense rivalry between local factions escalates, leading to clashes that test friendship, family bonds, and loyalty."
  }
];

function App() {
  const [movie, setMovie] = useState("");
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState("");

  // UI States
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [focusedMovie, setFocusedMovie] = useState(null); // For preview details modal

  const API_KEY = "b7c8f59";

  const handleSearch = () => {
    const query = movie.trim();
    if (!query) {
      setMovies([]);
      setMessage("");
      return;
    }

    // 🔍 Smart Logic: Check if search query matches any local movie name
    const localMatches = LOCAL_MOVIES.filter((m) =>
      m.Title.toLowerCase().includes(query.toLowerCase())
    );

    if (localMatches.length > 0) {
      setMovies(localMatches);
      setMessage("");
      return;
    }

    // ❌ OMDB API: allow ONLY Avengers (case-insensitive)
    if (query.toLowerCase() !== "avengers") {
      setMovies([]);
      setMessage("⚠️ Only 'Avengers' (or local movies like Aavesham, Minnal Murali, Vaazha) search is allowed");
      return;
    }

    // ✅ clear message if correct input
    setMessage("");

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.Search) {
          const formatted = data.Search.map((m) => ({
            Title: m.Title,
            Year: m.Year,
            Genre: "Action / Sci-Fi",
            Runtime: "2h 30min",
            Rating: (Math.random() * 1.2 + 8.5).toFixed(1),
            Poster: m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/300x450",
            Plot: "Search result for the Avengers cinematic universe."
          }));
          setMovies(formatted);
        } else {
          setMovies([]);
        }
      });
  };

  const selectGenre = (genreKey) => {
    setSelectedGenre(genreKey);
    setMovies([]); // Reset searched results on genre filter click
  };

  const triggerSearchFocus = () => {
    const inputEl = document.getElementById("search-input-field");
    if (inputEl) inputEl.focus();
  };

  // Filter movies by genre if no search has run, otherwise show search results
  const filteredLocalMovies = selectedGenre === "all" 
    ? LOCAL_MOVIES 
    : LOCAL_MOVIES.filter((m) => m.Genre.toLowerCase().includes(genreMap[selectedGenre]));

  const currentMovies = movies.length > 0 ? movies : filteredLocalMovies;

  return (
    <div className="app-container">
      <div className="screen-content">
        {/* Header */}
        <div className="app-header">
          <div className="menu-btn">
            <svg viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </div>
          <div className="welcome-text">
            <span className="welcome-label">Welcome!</span>
            <span className="user-name">Movie Lover</span>
          </div>
          <div className="avatar-wrapper">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" alt="avatar" />
          </div>
        </div>

        {/* Hero Banner Card with custom generated POPCORN Illustration */}
        <div className="hero-banner-card">
          <div className="hero-banner-text">
            <h2>What you want to watch?</h2>
            <button className="get-started-btn" onClick={triggerSearchFocus}>Get Start</button>
          </div>
          <div className="hero-banner-image">
            <img src={movieHeroIllustration} alt="3D cute popcorn character illustration watching movies" />
          </div>
        </div>

        {/* Search Box */}
        <div className="search-bar-container">
          <div className="search-input-box">
            <svg className="search-icon-svg" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              id="search-input-field"
              type="text"
              placeholder="Search..."
              value={movie}
              onChange={(e) => setMovie(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {movie && (
              <button className="clear-btn" onClick={() => { setMovie(""); setMovies([]); setMessage(""); }}>
                ×
              </button>
            )}
          </div>
        </div>

        {/* Error Message Banner */}
        {message && (
          <div className="error-alert">
            <span>{message}</span>
          </div>
        )}

        {/* Categories / Genres Badge Row */}
        <div className="genre-badges-row">
          <button 
            className={`genre-badge ${selectedGenre === "all" ? "active" : ""}`}
            onClick={() => selectGenre("all")}
          >
            <span>🔥 All</span>
          </button>
          <button 
            className={`genre-badge ${selectedGenre === "action" ? "active" : ""}`}
            onClick={() => selectGenre("action")}
          >
            <span>⚡ Action</span>
          </button>
          <button 
            className={`genre-badge ${selectedGenre === "comedy" ? "active" : ""}`}
            onClick={() => selectGenre("comedy")}
          >
            <span>🎭 Comedy</span>
          </button>
          <button 
            className={`genre-badge ${selectedGenre === "animation" ? "active" : ""}`}
            onClick={() => selectGenre("animation")}
          >
            <span>🎨 Animation</span>
          </button>
        </div>

        {/* Recommended Section */}
        <div className="section-header">
          <h3>{movies.length > 0 ? "Search Results" : "Recommended"}</h3>
        </div>

        {/* Movie Cards list */}
        <div className="recommended-list">
          {currentMovies.map((m, index) => (
            <div 
              key={index} 
              className="movie-recommend-card"
              onClick={() => setFocusedMovie(m)}
            >
              <div className="poster-container">
                <img src={m.Poster} alt={m.Title} />
                <div className="play-badge-floating">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="recommend-card-info">
                <span className="duration-label">• {m.Runtime}</span>
                <h4 className="movie-recommend-title">{m.Title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL PREVIEW OVERLAY (when a movie is clicked) */}
      {focusedMovie && (
        <div className="detail-modal-overlay" onClick={() => setFocusedMovie(null)}>
          <div className="detail-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setFocusedMovie(null)}>×</button>
            <div className="modal-poster">
              <img src={focusedMovie.Poster} alt={focusedMovie.Title} />
            </div>
            <div className="modal-details">
              <span className="modal-genre">{focusedMovie.Genre} • {focusedMovie.Year}</span>
              <h2 className="modal-title">{focusedMovie.Title}</h2>
              <div className="modal-meta-row">
                <span className="modal-rating">⭐ {focusedMovie.Rating}/10</span>
                <span className="modal-runtime">{focusedMovie.Runtime}</span>
              </div>
              <p className="modal-plot">{focusedMovie.Plot}</p>
              <button className="modal-watch-btn" onClick={() => alert(`Playing ${focusedMovie.Title}...`)}>
                Play Movie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Genre map helper to filter local movies
const genreMap = {
  action: "action",
  comedy: "comedy",
  animation: "animation"
};

export default App;