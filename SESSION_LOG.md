# Session Log - January 22, 2026

## Overview
This session focused on validating the database schema for the `user-service`, setting up the `content-service` structure, and troubleshooting environment and dependency issues across the backend services.

---

## Code Modifications Detail

### 1. Backend: User Service

#### `backend/user-service/prisma.config.ts`
**Change:** Updated how environment variables are loaded to support the root directory structure.
**Reason:** The `.env` file is in the project root (`../../`), not in the service directory. Without this, Prisma couldn't find `DATABASE_URL`.

```typescript
// BEFORE
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// AFTER
import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from two directories up
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export default defineConfig({ ... });
```

---

### 2. Backend: Content Service

#### `backend/content-service/src/config/firebase-admin.ts`
**Change:** Switched from namespace import to default import and added error handling.
**Reason:** `import * as admin` failed in the ESM environment (Node 25), causing `admin.apps` to be undefined. The `try/catch` block prevents the service from crashing when environment variables are missing.

```typescript
// BEFORE
import * as admin from "firebase-admin";
let fireBaseAdmin = admin.apps.length > 0 ? admin.app() : null;

// AFTER
import admin from "firebase-admin"; // Changed to default import
let fireBaseAdmin: admin.app.App | null = admin.apps && admin.apps.length > 0 ? admin.app() : null;

export function initializeFirebaseAdmin() {
  // Added check to warn instead of crash if env vars are missing
  if (!process.env.FIREBASE_PROJECT_ID...) {
    console.warn('Firebase configuration missing...');
    return null;
  }
  // ... initialization logic
}
```

#### `backend/content-service/src/controllers/postController.ts` & `resourceController.ts`
**Change:** Fixed type import errors.
**Reason:** These were typos causing compile-time errors.

```typescript
// postController.ts
- import { Request, Resource } from "express"; // Typo: Resource
+ import { Request, Response } from "express";

// resourceController.ts
- import { Request, Reponse } from "express";  // Typo: Reponse
+ import { Request, Response } from "express";
```

#### `backend/content-service/package.json`
**Change:** Updated the development script.
**Reason:** `nodemon` was not installed, but `tsx` was available and consistent with other services.

```json
// BEFORE
"dev": "nodemon src/index.ts"

// AFTER
"dev": "tsx watch src/index.ts"
```

---

### 3. Backend: API Gateway

#### `backend/api-gateway/src/config/firebase-admin.ts`
**Change:** Applied the same import fix as Content Service.
**Reason:** The gateway was crashing on startup with `TypeError: Cannot read properties of undefined (reading 'length')` due to the ESM import issue.

```typescript
// BEFORE
import * as admin from "firebase-admin";
let fireBaseAdmin = admin.apps.length > 0 ? ...

// AFTER
import admin from "firebase-admin";
let fireBaseAdmin: admin.app.App | null = admin.apps && admin.apps.length > 0 ? ...
```

---

## Infrastructure & Configuration

### Dependencies
*   **User Service:** Downgraded `prisma` and `@prisma/client` to `6.19.2` (from v7) to fix "missing module" errors and maintain compatibility with the existing schema syntax.
*   **Content Service:** Installed `cors` and `@types/cors`.
*   **API Gateway:** Ran `npm install` to ensure `tsx` was available.

### Environment
*   Verified that the root `.env` file exists and contains the `DATABASE_URL`.
*   Note: `FIREBASE_` keys are currently missing from `.env`, so Firebase features are running in a "disabled" state.

---

# Session Log - January 24, 2026

## Overview
This session focused on implementing the core controller logic for the `content-service`, performing a deep refactor of the `user-service` to align with the Prisma schema, and verifying the entire backend orchestration (API Gateway, User Service, Content Service) through integration testing.

---

## Code Modifications Detail

### 1. Backend: Content Service
- **`src/controllers/postController.ts`**: Implemented `createPost` and `getFeed` with Firebase Firestore.
- **`src/controllers/eventController.ts`**: Implemented `createEvent`, `getAllEvents`, `getEventDetails`, and `rsvpToEvent` (using Firestore transactions for attendee counts).
- **`src/controllers/resourceController.ts`**: Implemented `uploadResource` (using Multer and Firebase Storage), `searchResources`, and `downloadResource` (generating signed URLs).
- **`src/routes/resourceRoutes.ts`**: Integrated `multer` middleware for memory storage file handling.
- **`src/config/firebase-admin.ts`**: Fixed TypeScript return type error in `getFirebaseAdmin`.

### 2. Backend: User Service
**Refactor Goal:** Align controllers with the current Prisma schema (String `uid` instead of Integer `student_id`).
- **`src/controllers/userController.ts`**: 
    - Replaced `student_id`, `teacher_id`, `admin_id` (Integer) with `uid` (String/Firebase UID).
    - Removed logic for non-existent fields (`is_frozen`, `is_active`).
    - Corrected enum usage (`UserType` from `@prisma/client`).
- **`src/controllers/organizationController.ts`**: 
    - Removed references to `created_at`/`updated_at` (not in schema).
    - Switched ID fields to `uid`.
- **`src/controllers/schoolController.ts`**:
    - Switched ID fields to `uid`.
- **`src/mongoose/verificationModel.ts`**: Changed `userId` and `verificationRequestedBy` from `Number` to `String` to support Firebase UIDs.
- **`src/index.ts`**: Added a `/health` endpoint to support Gateway health checks.

### 3. Backend: API Gateway
- **`src/index.ts`**: 
    - Fixed typo `USER_SERCVICE_URL` to `USER_SERVICE_URL`.
    - Fixed typo `healhty` to `healthy` in health check logic.
    - Fixed path `/health/sertvices` to `/health/services`.

---

## Infrastructure & Configuration

### Dependencies
- **Content Service**: Installed `multer` and `@types/multer` for file upload support.

### Verification
- **Integration Test**: Verified all services (Gateway, User, Content) are building and communicating on ports 3000, 3001, and 3002.
- **Results**: Gateway health check passes; service health check (probing downstream) successfully returns 200 OK.

---

# Session Log - January 27, 2026

## Overview
This session focused on fully implementing the resource management capabilities in the `content-service`. This involved setting up Firebase Storage and Firestore integration, configuring Multer for file handling, and implementing the controller logic for uploading, searching, and downloading resources.

---

## Code Modifications Detail

### 1. Backend: Content Service

#### `backend/content-service/src/controllers/resourceController.ts`
**Change:** Refactored to use MongoDB (Mongoose) instead of Firebase for data and file storage.
**Reason:** To align with the project architecture of using MongoDB for unstructured data (images/files) and keeping Firebase exclusively for authentication and security.
- **Implementation:** Files are stored as `Buffer` within the MongoDB document (suitable for resources < 16MB). Search logic was updated to use Mongoose queries.

#### `backend/content-service/src/mongoose/resourceModel.ts`
**Change:** Created a new Mongoose schema for resources.
**Reason:** To handle resource metadata and binary file data within the MongoDB ecosystem, consistent with the `user-service` methodology.

#### `backend/content-service/src/index.ts`
**Change:** Established as the service entry point, incorporating MongoDB connection logic and route definitions.
**Reason:** To simplify the service architecture and improve maintainability by centralizing startup logic and reducing unnecessary file depth (removed `src/config/db.ts`).

---

## Infrastructure & Configuration

### Dependencies
- **Content Service:** Added `mongoose`, `dotenv`, and `cors`. Removed `firebase-admin` storage dependencies in favor of native MongoDB handling.

### Troubleshooting
- **TypeScript Alignment:** Fixed type mismatches in Express response headers for file downloads by providing fallbacks for `contentType` and `originalName`.
- **Architectural Cleanup:** Deleted `src/firebase.ts` and `src/config` folder to prevent configuration drift and maintain a lean microservice structure.
