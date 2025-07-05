# YUGIXX - Full Stack User Management Platform

A modern full-stack application for user management and authentication, built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (signup/login)
- JWT-based authentication
- Protected dashboard
- Modern and responsive UI
- API testing with Postman
- Automated testing with Newman

## Project Structure

```
yugixx/
  ├── frontend/       # React frontend application
  ├── backend/        # Node.js backend API
  └── postman/        # Postman collection for API testing
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or Atlas)
- Postman (for API testing)
- Newman (for automated testing)

## Installation

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd yugixx/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   VITE_API_URL=http://localhost:5000
   ```

### Backend

1. Navigate to the backend directory:
   ```bash
   cd yugixx/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/yugixx
   JWT_SECRET=your_jwt_secret_key_here
   ```

## Running the Application

1. Start MongoDB (if using local)
2. Start the backend server:
   ```bash
   cd yugixx/backend
   npm run dev
   ```
3. Start the frontend development server:
   ```bash
   cd yugixx/frontend
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## API Testing

### Using Postman

1. Import the Postman collection from `postman/YUGIXX_API.postman_collection.json`
2. Run the collection in Postman to test all API endpoints

### Using Newman (CLI)

1. Install Newman globally:
   ```bash
   npm install -g newman
   ```
2. Run the collection:
   ```bash
   newman run postman/YUGIXX_API.postman_collection.json
   ```
3. Generate HTML report:
   ```bash
   newman run postman/YUGIXX_API.postman_collection.json -r htmlextra
   ```

## API Endpoints

### Authentication

- `POST /api/signup`
  - Create a new user account
  - Required fields: name, email, password

- `POST /api/login`
  - Login to existing account
  - Required fields: email, password

### Dashboard

- `GET /api/dashboard`
  - Get user dashboard data
  - Requires authentication token

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 