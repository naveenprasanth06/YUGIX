# YUGIXX Backend

This is the backend API for the YUGIXX platform, built with Node.js, Express, and MongoDB.

## Features

- User authentication (signup/login)
- JWT-based authentication
- Protected routes
- MongoDB integration
- Error handling
- API documentation

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or Atlas)

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd yugixx/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/yugixx
   JWT_SECRET=your_jwt_secret_key_here
   ```

## Running the Application

1. Start MongoDB (if using local)
2. Start the development server:
   ```bash
   npm run dev
   ```
3. The server will run on `http://localhost:5000`

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

## Testing

Run the test suite:
```bash
npm test
```

## Project Structure

```
backend/
  ├── models/         # Database models
  ├── routes/         # API routes
  ├── middleware/     # Custom middleware
  ├── server.js       # Main application file
  └── package.json    # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 