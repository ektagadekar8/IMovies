# 🎬 IMovies — MERN Stack Movie Ticket Booking System

A modern, responsive movie discovery and ticket booking web application built using the **MERN Stack (MongoDB, Express.js, React.js, and Node.js)**. IMovies allows users to explore movies, search for titles, select a movie, and book tickets by submitting their details.

## 📌 Project Overview

IMovies is a full-stack web development project designed to demonstrate frontend development, REST API integration, backend development, and database operations using MongoDB.

The application provides a movie browsing interface with a booking form. Booking information is validated by the backend and stored in MongoDB Atlas.

## ✨ Features

- **Movie Listing:** Displays movies retrieved from MongoDB.
- **Movie Search:** Search for movies by title.
- **Movie Details:** Displays movie titles, genres, ratings, years, and visual elements.
- **Ticket Booking:** Select a movie and enter customer details.
- **Booking Validation:** Validates booking details before saving.
- **MongoDB Integration:** Stores booking information persistently in MongoDB Atlas.
- **REST API:** Connects the React frontend with the Express backend.
- **Responsive UI:** Dark-themed interface designed for movie lovers.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development server and build tool |
| Node.js | JavaScript runtime |
| Express.js | Backend server and REST APIs |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| HTML5 and CSS3 | Structure and styling |
| JavaScript | Application logic |
| Git and GitHub | Version control and project hosting |

## 📂 Project Structure

```text
IMovies/
├── backend/
│   ├── server.js
│   ├── Booking.js
│   ├── Movie.js          # If created separately
│   ├── .env               # Private configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
```

*Note: The structure above is illustrative. Keep only files and folders that actually exist in your project.*

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

- [Node.js and npm](https://nodejs.org/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Git](https://git-scm.com/)
- A code editor such as Visual Studio Code

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd IMovies
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
```

Replace the placeholder with your MongoDB Atlas connection string. Never commit your actual database credentials to GitHub.

### 3. Start the backend

From the `backend` directory, run:

```bash
node server.js
```

The backend should start at:

`http://localhost:5000`

### 4. Configure and start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal. The port may vary depending on availability.

## 🔌 API Endpoints

The backend currently provides the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Checks backend status |
| GET | `/api/movies` | Retrieves the movie list |
| POST | `/api/bookings` | Validates and saves a movie booking |

### Example: Create a Booking

**Endpoint:** `POST /api/bookings`

**Request body:**

```json
{
  "customerName": "Test User",
  "movieId": "YOUR_MOVIE_OBJECT_ID",
  "movieTitle": "Interstellar",
  "tickets": 2,
  "showDate": "2026-10-25"
}
```

Use an actual movie ID returned by the movies API.

**Successful response:** HTTP `201 Created`, with a confirmation message and the saved booking document.

## 🗄️ Database Design

The application uses MongoDB Atlas to store movie and booking records.

### Movies Collection

Contains movie information such as:

- Movie title
- Genre
- Rating
- Creation and update timestamps

### Bookings Collection

Contains booking information such as:

- Customer name
- Movie ID
- Movie title
- Number of tickets
- Show date
- Creation and update timestamps

Mongoose schemas define the data structure and validation rules.

## 🧪 How to Test the Application

1. Start MongoDB connectivity through the configured Atlas connection.
2. Start the Express backend.
3. Start the React frontend.
4. Browse the available movies.
5. Search for a movie by title.
6. Click **Book Tickets**.
7. Enter a name, ticket quantity, and show date.
8. Click **Confirm Booking**.
9. Verify the saved record in MongoDB Atlas under the `imovies` database and `bookings` collection.

## 🚀 Future Enhancements

The following features could be added in future versions:

- User registration and login
- Theatre and showtime selection
- Interactive seat selection
- Online payment integration
- Booking history and cancellation
- Booking confirmation with a unique reference number
- Movie posters and trailer integration
- Admin dashboard for managing movies and bookings
- Deployment to a public hosting platform

## 🎯 Learning Outcomes

This project demonstrates practical experience with:

- Building a React-based user interface
- Creating RESTful APIs with Express.js
- Connecting a Node.js application to MongoDB Atlas
- Designing Mongoose schemas
- Handling asynchronous HTTP requests
- Validating and persisting booking data
- Organizing a full-stack application

## 👩‍💻 Author

**Ekta Gadekar**

B.Tech Computer Science Student

Project: IMovies — MERN Stack Movie Ticket Booking System

## 📄 License

This project was developed for educational and academic purposes. A license can be added if the project is distributed publicly.
