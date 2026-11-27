# Day 4 – Express Middleware & Validation

## Objective
Build an Express.js API prototype for a document approval workflow with version history and approval permissions.

## Tech Stack
- Node.js
- Express.js
- Zod validation
- JavaScript

## Features
1. Create new document versions.
2. Validate request data using Zod.
3. Restrict version creation to editors and admins.
4. Restrict approval to approvers and admins.
5. Maintain document version history.
6. Generate unique request IDs and log incoming requests.
7. Handle errors centrally.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/documents/:documentId/versions` | Create a version |
| POST | `/api/documents/:documentId/approve` | Approve or reject a version |
| GET | `/api/documents/:documentId` | View version history |

## Verification
Tested valid version creation, invalid input validation, unauthorized access, version approval, and version history retrieval.

## Architecture
Request → Request Logger → Route → Authorization → Validation → Business Logic → Response

Errors are passed to centralized error-handling middleware.

## Limitation
This is an in-memory prototype. Data resets when the server restarts. Request role headers are used for demonstration only and are not production authentication.

## Conclusion
Implemented an Express.js document approval workflow demonstrating custom middleware, input validation, authorization checks, version history, and centralized error handling.