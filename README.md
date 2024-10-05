Country Info App
This project is a full-stack web application built to display information about countries, including population trends and border countries. It consists of two parts: the backend (built with Express.js) and the frontend (built with Next.js).

Prerequisites
Node.js (v18+)
npm (v6+)
Project Structure

/country-app/backend       
# Backend (Express.js)

/country-app/frontend       
# Frontend (Next.js)

Backend - Express.js
The backend is responsible for fetching country data from external APIs and providing it to the frontend.

Installation and Setup

Clone the repository and navigate to the backend folder:
git clone [<repo-url>](https://github.com/ManuelNavarro7/country-app.git)
cd country-app/backend


Install the dependencies:

npm install
Create a .env file in the backend directory with the following content:

PORT=5001

Available Scripts
npm start: Starts the backend server at http://localhost:5001.
API Endpoints
/api/countries/available

Method: GET
Description: Fetches a list of available countries using the Nager.Date API.
/api/countries/info/:countryCode

Method: GET

Description: Fetches detailed information about a country, including border countries, population data, and flag URL.
Parameters: countryCode - The 2-letter ISO country code (e.g., UA for Ukraine).

CORS Configuration
To allow communication between the frontend and backend, CORS must be enabled. The current setup allows requests from http://localhost:3000. If you need to change the allowed origin, modify the CORS settings in app.js:

const corsOptions = {
  origin: 'http://localhost:3000',
};
app.use(cors(corsOptions));

External APIs Used
Nager.Date API
CountriesNow API


Frontend - React.js (Next.js)
The frontend displays a list of countries, allowing users to view detailed information about each country, including population data over time and border countries.

Installation and Setup
Clone the repository and navigate to the frontend folder:

git clone [<repo-url>](https://github.com/ManuelNavarro7/country-app.git)

cd country-app/frontend

Install the dependencies:
npm install

Create a .env.local file in the frontend directory with the following content:
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001

Available Scripts
npm run dev: Starts the development server at http://localhost:3000.
npm run build: Builds the application for production.
npm run start: Runs the production build.

Features
Country List: Displays a clickable list of available countries.
Country Info: Shows detailed information about each country, including its flag, population over time (via a chart), and border countries.
Responsive Design: Fully responsive UI using Tailwind CSS.
Population Data Chart: Uses Chart.js for rendering historical population data.
Environment Variables
The frontend communicates with the backend using environment variables. Ensure the backend URL is correctly set in .env.local:
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
External APIs Used
Communicates with the backend, which retrieves data from Nager.Date and CountriesNow.
Running the Application
To run both the frontend and backend simultaneously:

Start the Backend:

Navigate to the backend folder and run:

npm start
Start the Frontend:

Navigate to the frontend folder and run:

npm run dev

Both the frontend and backend will run on different ports (3000 for the frontend and 5001 for the backend) and communicate with each other seamlessly.
