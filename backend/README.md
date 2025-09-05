# Collaborative Event & Polling Platform - Backend

Stack: Node.js, Express, MongoDB Atlas, JWT, Joi

Setup:
- Copy .env.example to .env and set MONGODB_URI (Atlas), JWT_SECRET, CORS_ORIGIN.
- From backend/, install and run:
  - npm install
  - npm run dev
- Base URL: http://localhost:${PORT}/api
- Health check: GET /health

Endpoints:
- Auth: POST /auth/signup, POST /auth/login, GET /auth/me
- Events: GET/POST /events, GET/PATCH/DELETE /events/:id
- Invites: POST /events/:id/invitations, GET /invitations, POST /invitations/:invitationId/respond
- Polls: POST /events/:id/votes, GET /events/:id/results

Permissions:
- Only creator can update/delete an event or invite users.
- Participants (or creator) can vote.
- Input validation via Joi; centralized error handling returns clean JSON.

See postman.txt for ready-to-use API requests.
