# 🎬 IMovies — Movie Ticket Booking System

IMovies is a full-stack MERN web application that allows users to explore movies, create an account, log in, and book movie tickets through a simple and user-friendly interface.

## 🌐 Live Demo

- **Frontend:** https://i-movies-three.vercel.app/
- **Backend API:** https://imovies-ur5f.onrender.com

## ✨ Features

- 🎥 **Movie Listing:** Browse available movies with their genres and ratings.
- 🔐 **User Authentication:** Sign up and log in to your account.
- 🎟️ **Ticket Booking:** Select available show details and book movie tickets.
- 💺 **Seat Selection:** Choose seats where supported by the booking interface.
- 🗄️ **Database Integration:** Store and retrieve application data using MongoDB.
- 📱 **Interactive Interface:** Use the application through a web browser.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- HTML5 and CSS3

**Backend**
- Node.js
- Express.js
- REST API

**Database and Tools**
- MongoDB
- Git and GitHub
- Vercel for frontend deployment
- Render for backend deployment

## 📂 Project Structure

```text
IMovies/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
├── backend/
│   ├── server.js
│   └── package.json
└── README.md
```

*Note: The exact folder structure may vary depending on the files in the repository.*

## ⚙️ Run the Project Locally

### Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB Atlas account or a MongoDB instance
- Git (optional, for cloning the repository)

### 1. Clone the Repository

```bash
git clone https://github.com/ektagadekar8/IMovies.git
cd IMovies
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and configure:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_private_random_secret
PORT=5000
```

Replace the placeholder values with your own configuration. Never publish real credentials or secret keys.

Start the backend:

```bash
node server.js
```

The backend should run at `http://localhost:5000` when using port 5000.

### 3. Set Up the Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## 🔒 Environment Variables

The application uses environment variables for backend configuration and frontend API connectivity.

- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret used to sign authentication tokens.
- `PORT`: Backend server port.
- `VITE_API_URL`: Backend API base URL used by the frontend.

**Security:** Do not commit `.env` files, database credentials, or JWT secrets to GitHub.

## 🚀 Deployment

- Frontend hosted on Vercel.
- Backend hosted on Render.
- Database hosted on MongoDB Atlas.

## 🎯 Project Objective

The objective of IMovies is to demonstrate full-stack web development by connecting a React frontend, an Express backend, REST APIs, user authentication, and database operations in a movie ticket booking application.

## 🔮 Future Enhancements

- Movie search and filtering.
- Improved booking history and user dashboard.
- Enhanced seat availability management.
- Movie details and showtime improvements.
- Responsive UI enhancements.

## 👩‍💻 Author

**Ekta Gadekar**

GitHub: [@ektagadekar8](https://github.com/ektagadekar8)

---

*IMovies is a learning project developed to practice full-stack web development using the MERN stack.*