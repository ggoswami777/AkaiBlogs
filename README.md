# AkaiBlogs ⛩️

AkaiBlogs is a high-performance, developer-focused social blogging and real-time messaging platform built using Next.js 16 (App Router), Supabase (PostgreSQL), Redis, and BullMQ. 

What makes it stand out is its **zero-trust End-to-End Encryption (E2EE) chat engine** built with the Web Crypto API, a **custom block-based content editor**, a **scalable background worker architecture**, and a **fully containerized local infrastructure** via Docker Compose.

---

## 📸 Platform Showcases & Screenshots

> [!TIP]
> Place your high-quality screenshots inside the designated asset folders (e.g., `/public/screenshots/`) and update the paths below to showcase the application on GitHub.

### 1. Feed & Exploration Dashboard
*Place a screenshot here showing the main feed, showing trending score banners and categorized blogs.*
`![Feed Showcase](public/screenshots/feed_dashboard.png)`

### 2. Custom Block-Based Rich Text Editor
*Place a screenshot showing a blog post being created using your custom text blocks, headings, code highlights, and cover images.*
`![Custom Editor](public/screenshots/block_editor.png)`

### 3. Secure End-to-End Encrypted Chats
*Place a screenshot showing side-by-side chat screens with typing indicators, online presence, and E2EE badges.*
`![E2EE Chat](public/screenshots/e2e_chat.png)`

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

    subgraph Containerized_Edge ["Docker Containerized / Edge Layer"]
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
* **Asymmetric Key Exchange:** When a user registers, they generate an **ECDH P-256** key pair. The private key stays in the browser's **IndexedDB** and never leaves the device. The public key is uploaded to Supabase.
* **Shared Secret Derivation:** Before sending a message, the client derives a unique shared secret using their own private key and the peer's public key.
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
git clone https://github.com/your-username/akaiblogs.git
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
