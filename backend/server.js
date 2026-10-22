const Booking = require("./Booking");
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Movie schema
const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to IMovies API!",
    status: "Backend is running successfully",
  });
});

// Get movies from MongoDB
app.get("/api/movies", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ title: 1 });
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error.message);
    res.status(500).json({ message: "Could not fetch movies" });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const { customerName, movieId, movieTitle, tickets, showDate } = req.body;

    if (
      !customerName?.trim() ||
      !movieId ||
      !movieTitle ||
      !Number.isInteger(Number(tickets)) ||
      Number(tickets) < 1 ||
      !showDate ||
      Number.isNaN(Date.parse(showDate))
    ) {
      return res.status(400).json({
        message: "Please provide valid booking details.",
      });
    }

    const movieExists = await Movie.findById(movieId);

    if (!movieExists) {
      return res.status(404).json({ message: "Movie not found." });
    }

    const booking = await Booking.create({
      customerName: customerName.trim(),
      movieId,
      movieTitle: movieExists.title,
      tickets: Number(tickets),
      showDate: new Date(showDate),
    });

    res.status(201).json({
      message: "Booking saved successfully!",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error.message);
    res.status(500).json({ message: "Could not save booking." });
  }
});

// Connect to MongoDB, then start server
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    // Add starter movies only if the collection is empty
    const movieCount = await Movie.countDocuments();

    if (movieCount === 0) {
      await Movie.insertMany([
        { title: "Interstellar", genre: "Sci-Fi", rating: 8.7 },
        { title: "The Dark Knight", genre: "Action", rating: 9.0 },
        { title: "Inception", genre: "Thriller", rating: 8.8 },
      ]);

      console.log("Starter movies added to MongoDB!");
    }

    app.listen(PORT, () => {
      console.log(`IMovies backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startServer();