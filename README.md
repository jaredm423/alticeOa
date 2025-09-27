# Movie App 🎬

A full-stack demo application with:

- **Frontend:** React + Vite
- **Backend:** Spring Boot (Java)

The app shows trending movies (via TMDB API) with a custom UI, error handling, and caching.  
You can browse movies in the frontend, and the backend serves API endpoints and business logic.

A note about secrets:
At my previous role, we would set ENV vars on our AWS EC2s and have our application.yml read from these ENV vars.
I felt that it was inconvenient for someone to have to configure ENV vars to be able to run my application locally.
I've resorted to putting my application.yml with keys in .gitignore and having the user simply copy that file into the project to run.
At some point, to run locally, you need to see the secrets, if this was a hosted application, secrets would be a different story.
So, for the sake of being quick and convenient this is what I've chosen to do.

---

## 📦 Prerequisites

Make sure you have installed:

- **Node.js** (>= 18.x recommended)
- **npm**
- **Java** (>= 17)
- **Maven** (if not using Spring Boot wrapper)

---

## Application.yml template:

server:
  port: 8080

tmdb:
  v4Token: <your token>
  v3Key: <your key>

---

## 🚀 Running the Backend (Spring Boot)
0. Configure secrets!
    Add your api v4token and v3key from tmdb into the application.yml under tmdb
    Next the application.yml file into the resources folder under:
        alticeOA/movie-list/api/movie-api/src/main/resources

1. Navigate to the backend directory:
   cd alticeOA/movie-list/api/movie-api
   mvn spring-boot:run
   Should start nicely :D

2. Run tests!
    in /movie-api directory, run:
        mvn test

## 🚀 Running the Frontend (React + Vite)

1. Navigate to the frontend directory:
   cd alticeOA/movie-list/ui
   npm install
   npm run dev --> this starts the dev server on port 5173
   check http://localhost:5173 in your browser to ensure the application is running properly

2. Run test!
    in /ui directory, run:
        npm run test