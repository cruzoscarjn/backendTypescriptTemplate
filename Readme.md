# Typescript Starting Backend

This project intends to provide a template for starting a TypeScript-Express backend project using clean architecture from scratch. It also aims to include all boilerplate required when starting a new project, such as authorization and authentication features.

## Features

- **Clean Architecture**: Ensures the separation of concerns by organizing the code into layers, making it easier to manage and evolve.
- **Authorization and Authentication**: Comes pre-equipped with robust mechanisms for managing user access and identity verification.
- **TypeScript Support**: Leverages TypeScript for type safety, enhancing code quality and developer productivity.
- **Express Framework**: Utilizes Express, a minimal and flexible Node.js web application framework, to handle HTTP requests efficiently.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone and install the repository:
   ```bash
   git clone https://github.com/cruzoscarjn/backendTypescriptTemplate.git

   cd typescript-starting-backend

   npm install
   ```
2. Copy `.env.example` and put your values there.
3. Launch infrastructure 
  ```bash
  docker compose up -d
  ```
4. Launch dev server
  ```bash
  npm run start:dev
  ```
  This will launch the backend server on http://localhost:3000 by default.
 

### Tools and Technologies
* Node.js & Express: For creating the server and handling HTTP requests.
* TypeScript: For adding static type definitions to JavaScript.
* Jest: For unit and integration testing.
* ESLint & Prettier: For ensuring code quality and consistency.
* Swagger: For documentation