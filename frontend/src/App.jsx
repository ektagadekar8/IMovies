
import { useEffect, useState } from "react";
import "./App.css";

const movieDetails = {
  "Interstellar": {
    year: "2014",
    color: "movie-one",
    emoji: "🚀",
    genre: "Sci-Fi · Adventure",
  },
  "The Dark Knight": {
    year: "2008",
    color: "movie-two",
    emoji: "🦇",
    genre: "Action · Crime",
  },
  "Inception": {
    year: "2010",
    color: "movie-three",
    emoji: "🌃",
    genre: "Sci-Fi · Thriller",
  },
  "Dune: Part Two": {
    year: "2024",
    color: "movie-four",
    emoji: "🏜️",
    genre: "Sci-Fi · Drama",
  },
  "Spider-Man": {
    year: "2021",
    color: "movie-five",
    emoji: "🕷️",
    genre: "Action · Adventure",
  },
  "The Batman": {
    year: "2022",
    color: "movie-six",
    emoji: "🦇",
    genre: "Action · Crime",
  },
};


function App() {
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [customerName, setCustomerName] = useState("");
const [tickets, setTickets] = useState(1);
const [showDate, setShowDate] = useState("");
  
const [movies, setMovies] = useState([]);

useEffect(() => {
  fetch("https://imovies-ur5f.onrender.com/api/movies")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load movies");
      }
      return response.json();
    })
    .then((data) => {
      const formattedMovies = data.map((movie) => ({
        ...movie,
        id: movie._id,
       ...(movieDetails[movie.title] || {
  year: "2026",
  color: "movie-one",
  emoji: "🎬",
}),
genre:
  movieDetails[movie.title]?.genre || movie.genre,
      }));

      setMovies(formattedMovies);
    })
    .catch((error) => {
      console.error("Error loading movies:", error);
    });
}, []);

async function handleBooking(event) {
  event.preventDefault();

  try {
    const response = await fetch("https://imovies-ur5f.onrender.com/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName,
        movieId: selectedMovie._id,
        movieTitle: selectedMovie.title,
        tickets: Number(tickets),
        showDate,
      }),
    });

    
const responseText = await response.text();

let data;

try {
  data = JSON.parse(responseText);
} catch {
  console.error("Non-JSON response:", responseText);
  throw new Error(
    `Server returned HTML or invalid JSON (HTTP ${response.status}). Open the browser console to investigate.`
  );
}

if (!response.ok) {
  throw new Error(data.message || "Booking failed");
}


    alert("Booking confirmed and saved!");
    setSelectedMovie(null);
    setCustomerName("");
    setTickets(1);
    setShowDate("");
  } catch (error) {
    alert(error.message);
  }
}


  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <nav className="navbar">
        <a className="logo" href="#home">
          <span>i</span>MOVIES
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#movies">Movies</a>
          <a href="#about">About</a>
        </div>

        <button
          className="login-btn"
          onClick={() => alert("Login feature coming soon!")}
        >
          Sign In
        </button>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">YOUR MOVIE. YOUR MOMENT.</p>
            <h1>
              Every story
              <br />
              deserves a <span>big screen.</span>
            </h1>
            <p className="hero-text">
              Discover movies, explore showtimes, and get ready
              for your next unforgettable cinema experience.
            </p>
            <a href="#movies" className="primary-btn">
              Explore Movies <span>→</span>
            </a>
          </div>

          <div className="hero-art">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>
            <div className="hero-ticket">
              <span className="ticket-icon">🎬</span>
              <p>YOUR NEXT</p>
              <h2>Movie Night</h2>
              <span className="ticket-line"></span>
              <p className="ticket-bottom">LIGHTS. CAMERA. ACTION.</p>
            </div>
            <span className="floating-star star-one">✦</span>
            <span className="floating-star star-two">✧</span>
          </div>
        </section>

        <section className="movies-section" id="movies">
          <div className="section-heading">
            <div>
              <p className="eyebrow">NOW SHOWING</p>
              <h2>Explore <span>Movies</span></h2>
            </div>

            <input
              className="search-input"
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <article className="movie-card" key={movie.id}>
                <div className={`movie-poster ${movie.color}`}>
                  <span className="poster-emoji">{movie.emoji}</span>
                  <span className="rating">★ {movie.rating}</span>
                  <span className="poster-year">{movie.year}</span>
                </div>

                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.genre}</p>
                  <button
                    className="book-btn"
                    onClick={() => setSelectedMovie(movie)}
                  >
                    Book Tickets <span>→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <p className="empty-message">
              No movies found. Try another search.
            </p>
          )}
        </section>

        <section className="booking-banner" id="about">
          <div>
            <p className="eyebrow">YOUR SEAT IS WAITING</p>
            <h2>Make it a movie night.</h2>
            <p>Great movies. Great company. Unforgettable memories.</p>
          </div>
          <a href="#movies" className="primary-btn">
            Find Your Movie →
          </a>
        </section>
      </main>

      <footer>
        <a className="logo" href="#home">
          <span>i</span>MOVIES
        </a>
        <p>Made for movie lovers. © 2026 IMovies.</p>
      </footer>

      {selectedMovie && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="booking-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setSelectedMovie(null)}
            >
              ×
            </button>
            <span className="modal-emoji">{selectedMovie.emoji}</span>
            <p className="eyebrow">MOVIE SELECTED</p>
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.genre} · {selectedMovie.year}</p>
            
<form className="booking-form" onSubmit={handleBooking}>
  <label htmlFor="customerName">Your Name</label>
  <input
    id="customerName"
    type="text"
    placeholder="Enter your name"
    value={customerName}
    onChange={(event) => setCustomerName(event.target.value)}
    required
  />

  <label htmlFor="tickets">Number of Tickets</label>
  <input
    id="tickets"
    type="number"
    min="1"
    max="10"
    value={tickets}
    onChange={(event) => setTickets(event.target.value)}
    required
  />

  <label htmlFor="showDate">Show Date</label>
  <input
    id="showDate"
    type="date"
    min={new Date().toISOString().split("T")[0]}
    value={showDate}
    onChange={(event) => setShowDate(event.target.value)}
    required
  />

  <button className="primary-btn modal-action" type="submit">
    Confirm Booking
  </button>
</form>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
