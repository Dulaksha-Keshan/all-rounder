# Backend Unit Testing Strategy

## 1. Overview
This document explains how we test our backend microservices. The goal is to verify that the **business logic** inside our code works correctly. We do this by testing each function individually (Unit Testing) without needing to run the whole server or connect to a real database.

---

## 2. The Testing Flow (How It Works)
To test a controller function properly, we need to simulate the environment it runs in. We use a technique called "Mocking" to create fake versions of our dependencies.

Here is the step-by-step flow we follow for every test:

### Step 1: Mimic the Database
We do not touch the real database. Instead, we "mock" (fake) the database functions.
* **If the controller uses PostgreSQL:** We mock **Prisma**. We tell it to return specific dummy data (e.g., *"Pretend you found a user named John"*).
* **If the controller uses MongoDB:** We mock **Mongoose**. We simulate the database finding, saving, or updating documents.
* **If it uses both:** We mock both at the same time so the controller thinks it is talking to both databases.

### Step 2: Mimic the Web Server
The controller expects a web request from a user. Since there is no real user, we create fake objects:
* **`req` (Request):** We create a simple object containing the data we want to test (like `body`, `params`, or `headers`).
* **`res` (Response):** We create a fake response object that tracks if the controller tries to send back a status code (like `200` or `400`) or JSON data.

### Step 3: Run the Logic
We pass our fake `req` and `res` into the controller function. The function runs exactly as if a real user hit the API. It processes the data, performs calculations, and hits our "mock" database.

### Step 4: Verify the Output
Finally, we check the results:
* Did the controller send back the correct HTTP status code? (e.g., `201 Created`).
* Did it return the correct JSON message?
* Did it call the database functions correctly? (e.g., *"Did it try to save the user?"*)

---

## 3. Visual Process Diagram

This diagram shows the exact steps our test code performs:

```mermaid
graph TD
    subgraph "1. Preparation"
    A[Start Test File] --> B[Define Mocks]
    B --> B1[Mock Prisma / Postgres]
    B --> B2[Mock Mongoose / MongoDB]
    B --> C[Import Controller Dynamically]
    end

    subgraph "2. Execution"
    C --> D[Create Fake Request 'req']
    C --> E[Create Fake Response 'res']
    D & E --> F[Run Controller Function]
    end

    subgraph "3. Verification"
    F --> G{Check Logic}
    G -->|Verify| H[Was the DB called correctly?]
    G -->|Verify| I[Is the Status Code correct?]
    G -->|Verify| J[Is the JSON response correct?]
    end

    H & I & J --> K[Test Passed ✅]
