# ClinicalWebInterface Backend (Auth Service)

Minimal Node.js (Express) backend providing JWT-based authentication for the ClinicalWebInterface frontend. Includes:
- Endpoints: POST /auth/login, GET /auth/me, POST /auth/logout, optional POST /auth/refresh
- In-memory demo users (bcrypt-hashed password)
- CORS, Helmet, rate limiting, JSON responses
- Env-based config for local preview and integration

## Tech Stack

- Node.js >= 18
- Express
- JWT (HS256)
- bcryptjs
- joi (validation)
- helmet, cors, express-rate-limit
- nodemon (dev)

## Environment Variables

Create a .env file (see .env.example):

- PORT (default 4000)
- CORS_ORIGIN (default http://localhost:3000)
- JWT_SECRET (required)
- Optional REACT_APP_* keys for local consistency

Example:
```
PORT=4000
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=replace-with-a-strong-random-secret
```

## Install & Run

From this directory:

```
npm install
npm run dev
```

- Dev server: http://localhost:4000
- Health check: GET http://localhost:4000/health

## Demo Users

All demo users share the same password: `Password123!`

- anesth@example.com — role: anesthesiologist
- nurse@example.com — role: nurse
- surgeon@example.com — role: surgeon

## API

All responses are JSON and CORS-accessible from the configured origin.

### POST /auth/login

Request:
```
POST /auth/login
Content-Type: application/json

{ "email": "anesth@example.com", "password": "Password123!" }
```

Response 200:
```
{
  "token": "<JWT access token>",
  "user": { "id": "u-1001", "email": "anesth@example.com", "role": "anesthesiologist", "name": "Dr. A. Anesthesiologist" },
  "refreshToken": "<optional refresh token>"
}
```

Errors:
- 400 invalid input
- 401 invalid credentials

Curl:
```
curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"anesth@example.com","password":"Password123!"}'
```

### GET /auth/me

Requires Authorization: Bearer <token>.

Response 200:
```
{ "user": { "id": "...", "email": "...", "role": "...", "name": "..." } }
```

Curl:
```
TOKEN="put-access-token-here"
curl -s http://localhost:4000/auth/me -H "Authorization: Bearer $TOKEN"
```

### POST /auth/logout

Client-side no-op to clear token.

Response 200:
```
{ "success": true, "message": "Logged out. Delete tokens on client." }
```

Curl:
```
curl -s -X POST http://localhost:4000/auth/logout
```

### POST /auth/refresh (optional scaffold)

Exchange a refresh token for new access token. For demo only.

Request:
```
POST /auth/refresh
Content-Type: application/json

{ "refreshToken": "<refresh token>" }
```

Response 200:
```
{ "token": "<new access token>" }
```

## Frontend Integration

Configure the React app to use the backend base URL:

- REACT_APP_API_BASE=http://localhost:4000

Example client usage:
- POST ${REACT_APP_API_BASE}/auth/login
- GET ${REACT_APP_API_BASE}/auth/me with Authorization: Bearer <token>
- POST ${REACT_APP_API_BASE}/auth/logout

## Replacing In-Memory Users

- Replace `src/users/demoUsers.js` with DB-backed implementation.
- Implement `findUserByEmail` using your database.
- Ensure `passwordHash` is generated via bcrypt.

## Notes

- JWT secret must be set via env.
- Login endpoint rate-limited by IP.
- Helmet and CORS configured for local development.

