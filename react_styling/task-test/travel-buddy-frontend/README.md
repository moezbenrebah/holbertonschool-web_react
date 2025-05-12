# Travel Buddy Frontend

This is the frontend application for the Travel Buddy platform, built with Angular.

## Overview

The Travel Buddy frontend provides an intuitive interface for users to:
- Browse available guides and tours
- Book tours with local guides
- Manage bookings and view upcoming trips
- Create and manage guide profiles
- Publish and manage tours as a guide

## Project Structure

- `src/app/components`: Reusable UI components
- `src/app/pages`: Main page components
- `src/app/services`: API service integrations
- `src/app/shared`: Shared utilities, models, and components
- `src/app/guards`: Route guards for authentication

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- Angular CLI

### Installation
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
ng serve
```

3. Access the application at `http://localhost:4200`

## Building for Production

To build the app for production, run:
```bash
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## Features

- Responsive design for mobile and desktop
- JWT-based authentication
- Guide profile management
- Tour publishing and booking system
- User dashboard
- Guide dashboard
