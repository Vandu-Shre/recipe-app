# Recipe Book

Recipe Book is a modern web application designed to help users manage their recipes, plan meals, and discover new dishes based on ingredients they already have. Built with a user-friendly interface and robust backend services, it's the perfect tool for home cooks looking to organize their culinary life.

## Features

- **Recipe Management:** Users can create, view, edit, and delete their own recipes, complete with ingredients, instructions, and descriptions.
- **Weekly Meal Planner:** A dynamic meal planning tool allows users to organize their recipes into a weekly schedule. The view is responsive, showing a full weekly grid on desktop and a convenient single-day view for mobile devices.
- **Pantry Search:** Discover new recipes by searching for dishes that can be made with the ingredients you have on hand.
- **User Authentication:** Secure user registration and login functionality ensure that your data is private and accessible only to you.

## Technologies Used

### Frontend
- **React:** The application is built using React, a popular JavaScript library for building user interfaces.
- **TypeScript:** The entire frontend is written in TypeScript, providing type safety and enhancing code quality and maintainability.
- **React Router:** Handles all client-side routing, allowing for smooth navigation between different pages without full page reloads.
- **Axios:** A promise-based HTTP client used for making API requests to the backend.
- **Tailwind CSS:** A utility-first CSS framework that enables rapid and flexible UI development.

### Backend
- **Node.js:** The backend is built with Node.js, providing a scalable and efficient environment for running server-side JavaScript.
- **Express.js:** A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **MongoDB:** A NoSQL database used to store all application data, including user profiles, recipes, and meal plans.
- **Mongoose:** An elegant MongoDB object modeling tool for Node.js, providing a straightforward, schema-based solution to model your application data.
- **JSON Web Tokens (JWT):** Used for secure, stateless user authentication, ensuring that API requests are authenticated and authorized.
- **Bcrypt:** A library used to hash user passwords, providing a strong layer of security for user credentials.

### Deployment & Environment
- **Vite:** A fast build tool that significantly improves the development experience for the frontend.
- **Environment Variables:** The application uses environment variables to manage sensitive data and configuration settings, such as API URLs and database connection strings.

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (or yarn)
- MongoDB

### Steps

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    cd recipe-book
    ```

2.  **Set up the backend:**
    - Navigate to the backend directory.
    - Install dependencies: `npm install`
    - Create a `.env` file with your MongoDB URI and JWT secret.
    - Start the server: `npm start`

3.  **Set up the frontend:**
    - Navigate to the frontend directory.
    - Install dependencies: `npm install`
    - Create a `.env` file with your backend API URL.
    - Start the development server: `npm run dev`

4.  **Access the App:**
    The application will be available at `http://localhost:5173` (or the default port for your Vite server).

## Project Structure