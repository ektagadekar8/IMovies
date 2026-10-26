
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

const movieDetails = {
  Interstellar: {
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
  Inception: {
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
  const [authMode, setAuthMode] = useState(null);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("imoviesUser")) || null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [tickets, setTickets] = useState(1);
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("06:00 PM");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [seatLoading, setSeatLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [moviesError, setMoviesError] = useState("");

  const seatRows = ["A", "B", "C", "D", "E", "F"];
  const allSeats = seatRows.flatMap((row) =>
    Array.from({ length: 8 }, (_, index) => `${row}${index + 1}`)
  );

  // Load movies from the backend.
  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/api/movies`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load movies.");
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
          genre: movieDetails[movie.title]?.genre || movie.genre || "Movie",
        }));

        setMovies(formattedMovies);
        setMoviesError("");
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Error loading movies:", error);
          setMoviesError(
            "Could not load movies. Please check that the backend is running."
          );
        }
      });

    return () => controller.abort();
  }, []);

  // Load booked seats for the selected movie, date and show time.
  useEffect(() => {
    if (!selectedMovie || !showDate) {
      setBookedSeats([]);
      setSelectedSeats([]);
      setSeatLoading(false);
      return;
    }

    const controller = new AbortController();
    setSeatLoading(true);

    fetch(
      `${API_URL}/api/bookings/seats?movieId=${selectedMovie._id}&showDate=${encodeURIComponent(showDate)}&showTime=${encodeURIComponent(showTime)}`,
      { signal: controller.signal }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load seat availability.");
        }
        return response.json();
      })
      .then((data) => {
        setBookedSeats(data.bookedSeats || []);
        setSelectedSeats([]);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Seat availability error:", error);
          setBookedSeats([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setSeatLoading(false);
      });

    return () => controller.abort();
  }, [selectedMovie, showDate, showTime]);

  async function handleBooking(event) {
    event.preventDefault();

    if (!selectedMovie) return;
    if (!currentUser || !localStorage.getItem("imoviesToken")) {
  alert("Please sign in before booking tickets.");
  setAuthMode("login");
  return;
}

    if (selectedSeats.length !== Number(tickets)) {
      alert("Please select exactly as many seats as your ticket count.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("imoviesToken")}`,
  },
        body: JSON.stringify({
          customerName: customerName.trim(),
          movieId: selectedMovie._id,
          movieTitle: selectedMovie.title,
          tickets: Number(tickets),
          showDate,
          showTime,
          seats: selectedSeats,
        }),
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `The server returned an invalid response (HTTP ${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Booking failed.");
      }

      alert("Booking confirmed and saved!");

      setSelectedMovie(null);
      setCustomerName("");
      setTickets(1);
      setShowDate("");
      setShowTime("06:00 PM");
      setSelectedSeats([]);
    } catch (error) {
      alert(error.message || "Could not complete the booking.");
    }
  }

  async function handleAuth(event) {
    event.preventDefault();
    setAuthLoading(true);

    try {
      const endpoint = authMode === "signup" ? "signup" : "login";

      const payload =
        authMode === "signup"
          ? {
              name: authName.trim(),
              email: authEmail.trim(),
              password: authPassword,
            }
          : {
              email: authEmail.trim(),
              password: authPassword,
            };

      const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      if (endpoint === "signup") {
        alert("Account created! Please sign in.");
        setAuthMode("login");
      } else {
        setCurrentUser(data.user);
        localStorage.setItem("imoviesToken", data.token);
        localStorage.setItem("imoviesUser", JSON.stringify(data.user));
        setAuthMode(null);
        alert(`Welcome, ${data.user.name}!`);
      }

      setAuthPassword("");
    } catch (error) {
      alert(error.message || "Something went wrong.");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleSignOut() {
    localStorage.removeItem("imoviesToken");
    localStorage.removeItem("imoviesUser");
    setCurrentUser(null);
    alert("You have signed out.");
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

        {currentUser ? (
          <div className="nav-user">
            <span>Hi, {currentUser.name}</span>
            <button className="login-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => setAuthMode("login")}>
            Sign In
          </button>
        )}
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
              Discover movies, explore showtimes, and get ready for your next
              unforgettable cinema experience.
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
              <h2>
                Explore <span>Movies</span>
              </h2>
            </div>

            <input
              className="search-input"
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {moviesError && <p className="empty-message">{moviesError}</p>}

          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <article className="movie-card" key={movie.id}>
                <div className={`movie-poster ${movie.color}`}>
                  <span className="poster-emoji">{movie.emoji}</span>
                  <span className="rating">★ {movie.rating ?? "N/A"}</span>
                  <span className="poster-year">{movie.year}</span>
                </div>

                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.genre}</p>
                  <button
                    className="book-btn"
                    onClick={() => {
                      setSelectedMovie(movie);
                      setCustomerName(currentUser?.name || "");
                      setTickets(1);
                      setShowDate("");
                      setShowTime("06:00 PM");
                      setSelectedSeats([]);
                    }}
                  >
                    Book Tickets <span>→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredMovies.length === 0 && !moviesError && (
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

      {authMode && (
        <div className="modal-overlay" onClick={() => setAuthMode(null)}>
          <div
            className="booking-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setAuthMode(null)}>
              ×
            </button>

            <h2>{authMode === "signup" ? "Create Account" : "Welcome Back"}</h2>
            <p>
              {authMode === "signup"
                ? "Join IMovies to enjoy your movie experience."
                : "Sign in to your IMovies account."}
            </p>

            <form className="booking-form" onSubmit={handleAuth}>
              {authMode === "signup" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={authName}
                  onChange={(event) => setAuthName(event.target.value)}
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password (minimum 8 characters)"
                value={authPassword}
                onChange={(event) => setAuthPassword(event.target.value)}
                minLength={8}
                required
              />

              <button
                type="submit"
                className="primary-btn"
                disabled={authLoading}
              >
                {authLoading
                  ? "Please wait..."
                  : authMode === "signup"
                    ? "Create Account"
                    : "Sign In"}
              </button>
            </form>

            <p>
              {authMode === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => {
                  setAuthMode(authMode === "signup" ? "login" : "signup");
                  setAuthPassword("");
                }}
              >
                {authMode === "signup" ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      )}

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
            <p>
              {selectedMovie.genre} · {selectedMovie.year}
            </p>

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
                onChange={(event) => {
                  const count = Math.max(
                    1,
                    Math.min(10, Number(event.target.value) || 1)
                  );
                  setTickets(count);
                  setSelectedSeats((current) => current.slice(0, count));
                }}
                required
              />

              <label htmlFor="showDate">Show Date</label>
              <input
                id="showDate"
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                value={showDate}
                onChange={(event) => setShowDate(event.target.value)}
                required
              />

              <label htmlFor="showTime">Show Time</label>
              <select
                id="showTime"
                value={showTime}
                onChange={(event) => setShowTime(event.target.value)}
                required
              >
                <option>12:00 PM</option>
                <option>03:00 PM</option>
                <option>06:00 PM</option>
                <option>09:00 PM</option>
              </select>

              <label>Select Seats ({selectedSeats.length} selected)</label>

              {!showDate ? (
                <p>Please select a show date to view available seats.</p>
              ) : seatLoading ? (
                <p>Loading seats...</p>
              ) : (
                <div style={{ margin: "12px 0" }}>
                  <div
                    style={{
                      background: "#d8dce5",
                      color: "#222",
                      textAlign: "center",
                      padding: "8px",
                      borderRadius: "8px",
                      marginBottom: "16px",
                      fontWeight: 700,
                      letterSpacing: "3px",
                    }}
                  >
                    SCREEN
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
                      gap: "7px",
                    }}
                  >
                    {allSeats.map((seat) => {
                      const isBooked = bookedSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);

                      return (
                        <button
                          key={seat}
                          type="button"
                          disabled={isBooked}
                          onClick={() => {
                            if (isBooked) return;

                            setSelectedSeats((current) =>
                              isSelected
                                ? current.filter((item) => item !== seat)
                                : current.length < Number(tickets)
                                  ? [...current, seat]
                                  : current
                            );
                          }}
                          style={{
                            padding: "8px 2px",
                            border: "1px solid",
                            borderColor: isBooked
                              ? "#777"
                              : isSelected
                                ? "#48d597"
                                : "#aaa",
                            borderRadius: "6px",
                            background: isBooked
                              ? "#777"
                              : isSelected
                                ? "#16845b"
                                : "transparent",
                            color: isBooked || isSelected ? "#fff" : "inherit",
                            fontSize: "12px",
                            cursor: isBooked ? "not-allowed" : "pointer",
                          }}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "12px",
                      fontSize: "12px",
                      marginTop: "12px",
                    }}
                  >
                    <span>⬜ Available</span>
                    <span style={{ color: "#16845b" }}>🟩 Selected</span>
                    <span style={{ color: "#777" }}>⬛ Booked</span>
                  </div>
                </div>
              )}

              <button
                className="primary-btn modal-action"
                type="submit"
                disabled={
                  !showDate ||
                  selectedSeats.length !== Number(tickets) ||
                  seatLoading
                }
              >
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
