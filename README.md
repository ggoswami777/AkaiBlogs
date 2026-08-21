# AkaiBlogs ⛩️

<p align="center">
  <img src="./public/screenshots/feed_dashboard.png" alt="AkaiBlogs Cover" width="100%" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);" />
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
  <a href="https://socket.io"><img src="https://img.shields.io/badge/Socket.io-4.8-101010?style=for-the-badge&logo=socket.io" alt="Socket.io" /></a>
  <a href="https://redis.io"><img src="https://img.shields.io/badge/Redis-7.0-red?style=for-the-badge&logo=redis" alt="Redis" /></a>
  <a href="https://prisma.io"><img src="https://img.shields.io/badge/Prisma-7.7-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" /></a>
  <a href="https://bullmq.io"><img src="https://img.shields.io/badge/BullMQ-5.8-orange?style=for-the-badge" alt="BullMQ" /></a>
</p>

AkaiBlogs is a high-performance, developer-focused blogging and secure collaborative messaging platform. It is engineered with a **zero-trust End-to-End Encryption (E2EE) messaging protocol**, a **custom block-based content editor**, and a **containerized local infrastructure** via Docker Compose.

---

## 📸 Platform Showcases

### 1. Feed & Exploration Dashboard
The main feed is backed by a custom, asynchronous personal recommendation scorer. Trending weights and interests decay dynamically based on time and engagement.

<p align="center">
  <img src="./public/screenshots/feed_dashboard.png" alt="Feed Showcase" width="90%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);" />
</p>

### 2. Custom Block-Based Rich Text Editor
A custom-built block content engine that serializes nested layout blocks (text, headings, image objects, lists, code) into a single structured JSON schema.

<p align="center">
  <img src="./public/screenshots/block_editor.png" alt="Custom Editor" width="90%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);" />
</p>

### 3. Secure End-to-End Encrypted Chats
Secure chat sessions powered by client-side Web Crypto and Socket.IO. Features include real-time typing indicators, read receipts, and user presence tracking.

<p align="center">
  <img src="./public/screenshots/e2e_chat.png" alt="E2EE Chat" width="90%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);" />
</p>

---

## ⚙️ Architecture & Technical Flow

```mermaid
flowchart TD
    subgraph Client ["Client Browser (Next.js Frontend)"]
        UI["User Interface (Zustand State)"]
        Editor["Custom Block Editor"]
        WebCrypto["Web Crypto API (ECDH / AES-GCM)"]
        IDB["IndexedDB (Secure Private Key)"]
    end

    subgraph Containerized_Edge ["Docker Containerized Layer"]
        App["App Container (Next.js App)"]
        Socket["Socket Container (Socket.io Server)"]
        Workers["Workers Container (BullMQ Workers)"]
    end

    subgraph Storage ["Database & Search Infrastructure"]
        PG["Supabase Postgres"]
        Redis["Redis Container (Cache / BullMQ Broker)"]
        Algolia["Algolia Search Index"]
    end

    UI -->|1. Authenticates & Fetches Session| App
    UI -->|2. Opens WebSocket Connection| Socket
    UI -->|3. Fetches / Resolves Peer Public Keys| App
    UI -.->|4. Generates Shared Secret & Encrypts Locally| WebCrypto
    WebCrypto <-->|Read / Write Keys| IDB
    
    App <-->|SQL Operations| PG
    App -->|Publish Jobs| Redis
    App <-->|Cache Reads/Writes| Redis
    
    Socket <-->|Presence & WebSocket State| Redis
    Socket -->|Writes Messages| PG
    
    Workers <-->|Consumes & Dispatches Jobs| Redis
    Workers -->|Updates Database Records| PG
    
    PG -->|Database Webhooks| Algolia
    UI -->|Instant Search Requests| Algolia
```

---

## 🚀 Core Technical Features

### 🔒 Zero-Trust End-to-End Encryption (E2EE)
* **Asymmetric Key Exchange:** During registration, clients generate an **ECDH P-256** key pair. The private key remains stored locally inside **IndexedDB** and never leaves the device. The public key is uploaded to Supabase.
* **Shared Secret Derivation:** Before transmitting messages, the sender derives a unique shared key using their local private key and the receiver's public key.
* **Symmetric Encryption:** Plaintext messages are encrypted client-side using **AES-256-GCM** with a cryptographically secure random Initialization Vector (IV). Only ciphertext and the IV are stored on the database.
* **Auto-Healing:** If the database is wiped or reset, the client dynamically detects the missing public key, regenerates the keypair, updates IndexedDB, and synchronization recovers automatically.

### ✍️ Custom Block-Based Text Editor
* Designed from scratch to avoid heavy library dependencies.
* Serializes rich content into a clean, nested JSON block format, supporting paragraph, headings, code snippets, lists, and dynamic media embeds.
* Offers better payload compression and faster client-side parsing than traditional HTML string text stores.

### ⚡ Background Workers & Distributed Queues
* Leverages **BullMQ** and **Redis** to dispatch long-running operations away from the main thread.
* **OTP Email Worker:** Dispatches mail via Nodemailer when authentication codes are requested.
* **Trending Feed Engine:** Recomputes feed items based on post interaction scores (Views, Likes, Comments) and age (decays over time).
* **Analytics Worker:** Tracks user category weights asynchronously to personalize feed indexes.

### 🔍 Search Synchronization via Webhooks (Algolia)
* Rather than performing heavy resource-intensive SQL query matching (`LIKE %query%`) on PostgreSQL, search query matching is decoupled to **Algolia**.
* To prevent data drift, a secure **Supabase Database Webhook** is configured to trigger on any `INSERT`, `UPDATE`, or `DELETE` events within the `Blog` table.
* These webhooks dispatch payload modifications to a Next.js Edge handler route (`/api/webhooks/supabase`), which sanitizes the data using custom transformers and updates the Algolia index in real-time.

### 🌱 Deterministic Seed Script
* Features a production-safe Prisma seed script (`prisma/seed.ts`) that initializes the local schema with clean mock data.
* Creates a default administrator profile (`demo_ronin`), secures it using `bcrypt` password hashing, and populates categorized posts under Technology, Lifestyle, and Design classes to allow developers to experience the personalized feed routing instantly upon cloning.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 16 (App Router), React 19, Zustand, Tailwind CSS, Lucide Icons, Web Crypto API
* **Backend:** Next.js Serverless Routes, Socket.io, BullMQ (Workers)
* **Databases:** Supabase PostgreSQL (Prisma ORM), Upstash Redis
* **Search:** Algolia Instant Search
* **Testing:** Playwright (E2E testing), Vitest (Unit/API testing)
* **DevOps:** Docker, Docker Compose, GitHub Actions CI

---

## 📦 Local Development Setup

Follow these steps to run the complete environment locally.

### 1. Prerequisites
Make sure you have installed:
* [Node.js](https://nodejs.org/) (v20+ recommended)
* [Docker Desktop](https://www.docker.com/) (to run Redis & Postgres easily)

### 2. Clone the Repository
```bash
git clone https://github.com/ggoswami777/akaiblogs.git
cd akaiblogs
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root of the project:
```bash
cp .env.example .env
```
Fill out the variables inside `.env`. Here is a guide:

```env
# Database (Supabase or Local Postgres)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/akaiblogs"

# Auth (Generate a secure string)
JWT_SECRET="generate_a_random_jwt_secret_key"

# Email Verification (Gmail SMTP config)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-16-character-gmail-app-password"
EMAIL_FROM_NAME="AkaiBlogs Support"
OTP_EXPIRY_MINUTES=10

# Redis & WebSockets
REDIS_URL="redis://localhost:6379"
NEXT_PUBLIC_SOCKET_URL="http://localhost:4000"
SOCKET_PORT=4000
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# UploadThing (For Blog Cover Images)
UPLOADTHING_TOKEN="your_uploadthing_token_here"

# Algolia Config
NEXT_PUBLIC_ALGOLIA_APP_ID="your_algolia_app_id"
ALGOLIA_ADMIN_API_KEY="your_algolia_admin_key"
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY="your_algolia_search_key"

# Supabase Webhooks Security
SUPABASE_WEBHOOK_SECRET="generate_a_secure_webhook_passphrase"
```

### 5. Setup Local Database & Seed Data
Generate the Prisma Client and migrate your database:
```bash
npx prisma db push
```

Run the seed script to create test users and default blog posts:
```bash
npm run db:seed
```

### 6. Run the Application

You can run the application using either **Docker Compose** or **npm scripts locally**.

#### Option A: Running with Docker Compose (Recommended)
Start all services (Frontend, Socket server, Workers, and Redis instance) in containerized isolation:
```bash
docker-compose up --build
```

#### Option B: Running Locally with npm Scripts
If you prefer running without Docker containers:
```bash
# Starts Next.js app, Socket.IO server, and background workers concurrently
npm run dev:services
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing Suite

### Run Unit & API Route Tests (Vitest)
Unit and integration tests are located in `/tests`.
```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Generate test coverage reports
npm run test:coverage
```

### Run End-to-End Integration Tests (Playwright)
E2E browser automation tests are located in `/e2e`. Ensure you build the app first:
```bash
npx playwright install
npm run build

# Run E2E tests headlessly
npm run test:e2e

# Run E2E tests in the Interactive UI runner
npm run test:e2e:ui
```
