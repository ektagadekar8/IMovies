
const Booking = require("./Booking");
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Movie schema
const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    genre: { type: String, required: true },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

// User schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to IMovies API!",
    status: "Backend is running successfully",
  });
});

// Get movies
app.get("/api/movies", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ title: 1 });
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error.message);
    res.status(500).json({ message: "Could not fetch movies." });
  }
});

// Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "Name, email, and password (minimum 8 characters) are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "This email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email is already registered.",
      });
    }

    res.status(500).json({ message: "Could not create account." });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Please enter email and password.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing.");
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Could not log in." });
  }
});

// Get booked seats for a movie, date and show time
app.get("/api/bookings/seats", async (req, res) => {
  try {
    const { movieId, showDate, showTime = "06:00 PM" } = req.query;

    if (
      !mongoose.isValidObjectId(movieId) ||
      !showDate ||
      Number.isNaN(Date.parse(showDate)) ||
      typeof showTime !== "string"
    ) {
      return res.status(400).json({
        message: "Please provide a valid movie, date and show time.",
      });
    }

    const normalizedDate = new Date(showDate);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      movieId,
      showDate: normalizedDate,
      showTime,
    }).select("seats");

    const bookedSeats = [
      ...new Set(bookings.flatMap((booking) => booking.seats || [])),
    ];

    res.json({ bookedSeats });
  } catch (error) {
    console.error("Seat fetch error:", error.message);
    res.status(500).json({ message: "Could not fetch booked seats." });
  }
});

// Create booking
app.post("/api/bookings", async (req, res) => {
  try {
    const {
      customerName,
      movieId,
      tickets,
      showDate,
      showTime = "06:00 PM",
      seats,
    } = req.body;

    if (
      typeof customerName !== "string" ||
      !customerName.trim() ||
      !mongoose.isValidObjectId(movieId) ||
      !Number.isInteger(Number(tickets)) ||
      Number(tickets) < 1 ||
      !showDate ||
      Number.isNaN(Date.parse(showDate)) ||
      typeof showTime !== "string" ||
      !showTime.trim() ||
      !Array.isArray(seats) ||
      seats.length !== Number(tickets) ||
      seats.some((seat) => typeof seat !== "string" || !seat.trim()) ||
      new Set(seats).size !== seats.length
    ) {
      return res.status(400).json({
        message: "Please provide valid booking details and select one seat per ticket.",
      });
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    const normalizedDate = new Date(showDate);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    const existingBookings = await Booking.find({
      movieId,
      showDate: normalizedDate,
      showTime,
      seats: { $in: seats },
    });

    if (existingBookings.length > 0) {
      const bookedSeats = [
        ...new Set(
          existingBookings.flatMap((booking) =>
            (booking.seats || []).filter((seat) => seats.includes(seat))
          )
        ),
      ];

      return res.status(409).json({
        message: `These seats are already booked: ${bookedSeats.join(", ")}. Please select different seats.`,
        bookedSeats,
      });
    }

    const booking = await Booking.create({
      customerName: customerName.trim(),
      movieId,
      movieTitle: movie.title,
      tickets: Number(tickets),
      showDate: normalizedDate,
      showTime,
      seats,
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

// Connect to MongoDB and start server
async function startServer() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from the .env file");
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

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
