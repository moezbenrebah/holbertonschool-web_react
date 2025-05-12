# Travel Buddy

## Project Overview
Travel Buddy is a web application that connects travelers with local guides. Users can browse available guides based on location, specialties, and languages, then book personalized tours. Guides can create profiles, publish tour offerings, and manage their bookings.

## Author
Created by: Rayane ELK

## Features
- User registration and authentication
- Guide profile creation and management
- Tour publishing and booking system
- Booking requests with approval workflow
- User dashboard for tracking bookings and tours
- Guide dashboard for managing tours and bookings
- Search functionality for finding guides and tours

## Tech Stack
- **Frontend**: Angular
- **Backend**: Node.js with Express
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure
- `backend/`: Server-side code, API endpoints, and database models
- `travel-buddy-frontend/`: Angular frontend application
- `backend/models/`: Database models using Sequelize
- `backend/routes/`: API routes for different features
- `backend/middlewares/`: Custom middleware functions

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- Angular CLI

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=travel_buddy
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=24h
   ```
4. Initialize the database:
   ```
   node scripts/add-example-data.js
   ```
5. Start the server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd travel-buddy-frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Access the application at `http://localhost:4200`

## API Documentation
The API provides endpoints for users, guides, tours, and bookings. Full documentation can be found in the Postman collection.

## Future Improvements
- Review and rating system for guides and tours
- Messaging system between travelers and guides
- Payment integration
- Mobile application