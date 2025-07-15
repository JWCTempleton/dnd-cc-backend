# D&D Character Creator - Backend API

This repository contains the source code for the RESTful API that powers the D&D Character Creator application. It is a robust, secure, and scalable backend built with Node.js, Express, and MongoDB, using TypeScript for enhanced type safety and developer experience.

## Key Features

- **User Authentication:** Secure user registration and login system using JSON Web Tokens (JWTs).
- **Stateful Sessions:** JWTs are stored in secure, `httpOnly` cookies, providing a persistent and safe session management experience.
- **Password Security:** User passwords are never stored in plaintext. They are salted and hashed using `bcryptjs`.
- **Protected Routes:** A custom authentication middleware (`protect`) ensures that only authenticated users can access their private data.
- **Character CRUD Operations:** Full Create, Read, Update, and Delete functionality for a user's characters.
- **Character Leveling System:** A dedicated endpoint to handle the logic of leveling up a character, including increasing HP.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Language:** TypeScript
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **Middleware:** `cors`, `cookie-parser`, `express-async-handler`

## Design & Architecture Philosophy

This backend was designed with modern best practices in mind, prioritizing security, scalability, and separation of concerns.

### 1. Modular Structure

The application is organized into a feature-based modular structure:

- `/src/models`: Defines the Mongoose schemas (`userModel`, `characterModel`), acting as the single source of truth for our data shape. The `userModel` also contains pre-save middleware to automatically hash passwords.
- `/src/controllers`: Contains the core business logic for each route. Functions are organized by resource (e.g., `userController`, `characterController`) to keep the codebase clean.
- `/src/routes`: Defines the API endpoints (e.g., `POST /api/users/login`) and connects them to the appropriate controller functions. This layer is responsible for defining the API's public-facing contract.
- `/src/middleware`: Houses reusable middleware functions, such as the `protect` middleware for authentication and `errorHandler` for handling exceptions gracefully.

### 2. TypeScript and Mongoose Integration

TypeScript was chosen to prevent common runtime errors and improve code maintainability. A key challenge was ensuring strong typing with Mongoose. This was solved by creating dedicated TypeScript interfaces for each model (`IUser`, `IUserDocument`, `ICharacter`) which explicitly define the shape of the data and any custom methods. This allows for full autocompletion and type-checking throughout the application.

### 3. Authentication and Security

Security was a primary consideration from the start.

- **Stateless JWTs:** JWTs were chosen for authentication because they are stateless, meaning the server doesn't need to store session information.
- **`httpOnly` Cookies:** Storing the JWT in an `httpOnly` cookie is a critical security measure. It makes the token inaccessible to client-side JavaScript, which is the primary defense against Cross-Site Scripting (XSS) attacks.
- **CORS Configuration:** The Cross-Origin Resource Sharing (CORS) policy is explicitly configured to only allow requests from the trusted frontend domain. It also handles preflight `OPTIONS` requests, a necessary step for cross-domain authenticated requests to function correctly.
- **Production Cookie Policy:** For deployment, the authentication cookie is configured with `secure: true` and `sameSite: 'none'`. This is the modern standard for cross-domain authentication, ensuring the cookie is only sent over HTTPS while allowing the decoupled frontend and backend to communicate.

## Getting Started (Local Development)

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/dnd-creator-backend.git
    cd dnd-creator-backend
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Create a `.env` file** in the root directory and add the following environment variables:

    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_string
    PORT=5001
    ```

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    The server will be running on `http://localhost:5001`.

## Deployment

This application is deployed on **Render**. The deployment process uses the following scripts in `package.json`:

- **Build Command:** `pnpm build` (which runs `tsc` to compile TypeScript to JavaScript).
- **Start Command:** `pnpm start` (which runs `node dist/server.js`).

Environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`) must be configured in the Render dashboard for a successful deployment.
