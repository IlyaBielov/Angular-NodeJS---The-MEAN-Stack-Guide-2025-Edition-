# MEAN Stack Post Management Application

This is a simple post management application built with the MEAN stack (MongoDB, Express.js, Angular, Node.js). It allows users to create and view posts with titles and content.

## Technologies Used

- **Frontend**:
  - Angular 20.0.5
  - Angular Material 20.0.4
  - RxJS for reactive programming

- **Backend**:
  - Node.js
  - Express.js
  - Body-parser for request parsing

## Features

- Create posts with title and content
- View a list of all posts
- Responsive UI using Angular Material
- RESTful API for post management

## Project Structure

- `/src` - Angular frontend application
  - `/app/posts` - Post-related components and services
    - `/post-create` - Component for creating new posts
    - `/post-list` - Component for displaying posts
    - `post.model.ts` - TypeScript interface for post data
    - `posts.service.ts` - Service for managing posts data and API communication
- `/backend` - Express.js backend application
  - `app.js` - Main Express application with API routes
- `server.js` - Node.js server setup

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   ng serve
   ```
   or
   ```
   npm start
   ```
4. Start the backend server:
   ```
   npm run start:server
   ```
5. Open your browser and navigate to `http://localhost:4200/`

## Available Scripts

- `npm start` or `ng serve` - Start the Angular development server
- `npm run start:server` - Start the Node.js backend server with nodemon for auto-reloading
- `npm run build` - Build the Angular application for production
- `npm run test` - Run unit tests
- `npm run lint` - Run linting
- `npm run e2e` - Run end-to-end tests

## API Endpoints

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post

## Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 20.0.4.

### Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running Tests

- Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
- Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
