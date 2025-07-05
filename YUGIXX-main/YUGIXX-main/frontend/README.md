# YUGIXX Frontend

This is the frontend application for the YUGIXX platform, built with React and Vite.

## Features

- Modern and responsive UI
- User authentication (login/signup)
- Protected dashboard
- Real-time API integration
- Clean and maintainable code structure

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd yugixx/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be created in the `dist` directory.

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── App.jsx        # Main application component
  ├── App.css        # Global styles
  └── main.jsx       # Application entry point
```

## API Integration

The frontend communicates with the backend API at `http://localhost:5000`. Make sure the backend server is running before using the application.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://localhost:5000
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 