<div align="center">

# 🎮 Stash — Server

### *The vault's engine room.*

**The backend API for Stash — a full-stack game discovery & downloading platform.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-2ea44f?style=for-the-badge)](https://stash-pied-chi.vercel.app)
[![Client Repo](https://img.shields.io/badge/Client-Repository-black?style=for-the-badge&logo=github)](https://github.com/nihalxofficial/Stash-Online-Gaming-Site)

</div>

---

## 📑 Table of Contents

- [About](#-about)
- [Project Overview](#-project-overview)
  - [Objective](#objective)
  - [Deployments](#deployments)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Layered Architecture](#-layered-architecture)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Notes on Auth Architecture](#-notes-on-auth-architecture)
- [Notes on File Storage](#-notes-on-file-storage)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 📖 About

Stash's server is a standalone Express + MongoDB API, deployed completely independently from its Next.js frontend. It has no shared database session, no shared auth store, and no direct dependency on the frontend's runtime — the only contract between the two services is a signed JWT and a JWKS endpoint.

This backend was built to practice real API-design concerns beyond basic CRUD: verifying tokens issued by an entirely separate service, streaming uploaded files directly to cloud storage without ever touching local disk (a hard requirement for serverless deployment), and keeping every feature module internally consistent through a strict layered structure.

**What makes it different from a typical Express CRUD API:**
- **Zero-trust JWT verification** — every protected route fetches the frontend's public signing keys via JWKS and independently verifies signature, issuer, and expiry on each request; it never assumes a request is legitimate just because it has *a* token.
- **Serverless-safe file handling** — multer buffers uploads in memory (never to disk, since serverless filesystems are ephemeral/read-only) and streams them directly to Cloudinary.
- **Atomic, race-condition-safe counters** — download counts are incremented using MongoDB's `$inc` operator directly in the query, not read-then-write in application code, so concurrent downloads never produce incorrect counts.
- **One consistent architecture across every module** — Game, User, Review, and Download History all follow the identical Model → Repository → Service → Controller → Routes pipeline, so any new feature slots in without inventing new conventions.

---

## 🎯 Project Overview

### Objective
To design and build a production-shaped REST API for a game-downloading platform — handling search/filtering, cloud file delivery, cross-service authentication, and per-user activity tracking — while enforcing a consistent layered architecture across every feature module.

### Deployments
| Component | Link |
|---|---|
| 🌐 Live App (client) | [stash-pied-chi.vercel.app](https://stash-pied-chi.vercel.app) |
| 📁 Client Repo | [Stash-Online-Gaming-Site](https://github.com/nihalxofficial/Stash-Online-Gaming-Site) |

---

## ✨ Key Features

- **JWKS-based JWT verification** — no shared session store with the frontend; every request's `Authorization: Bearer <token>` is validated against keys fetched live from the frontend's `/api/auth/jwks` endpoint.
- **Cloudinary-backed file pipeline** — game installer files never touch this server's disk; they're buffered in memory by multer and streamed directly to Cloudinary as `raw` resources, with the resulting URL stored on the `Game` document.
- **Automatic download tracking** — each download simultaneously (1) creates a `DownloadHistory` record tying the user to the game and timestamp, and (2) atomically increments the game's `downloadCount` via `$inc`.
- **Populated foreign-key relationships** — `Game.owner`, `Review.user`, and `Review.game` are all Mongoose `ObjectId` references resolved on demand via `.populate()`, avoiding duplicated user/game data across collections.
- **Backend-driven search** — genre, platform, and title filters are handled via MongoDB query building in the service layer, not returned as a full list for the client to filter.
- **Consistent, predictable module structure** — every feature is instantly navigable once you understand one module, since they all follow the exact same five-file pipeline.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **TypeScript** | Static typing across the entire API |
| **Node.js** | Runtime |
| **Express.js** | HTTP server & routing |
| **MongoDB** | Primary database |
| **Mongoose** | ODM — schemas, models, population, query building |
| **Dotenv** | Environment variable management |
| **Cors** | Cross-origin access control between the two deployed domains |
| **Multer** | Multipart/form-data parsing + in-memory file buffering |
| **Cloudinary** | Cloud storage & delivery for uploaded game files (raw resource type) |
| **Jose-cjs** | JWKS fetching + JWT signature/issuer/expiry verification |

---

## 🏗️ Layered Architecture

Every feature module — `game`, `user`, `review`, `downloadHistory` — follows the exact same five-layer pipeline. A request only ever flows downward through these layers, and a response only ever flows back up through them:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CLIENT REQUEST                            │
└─────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│  ROUTES         (*.routes.ts)                                          │
│  ────────────────────────────────────────────────────────────────────  │
│  • Maps URL + HTTP method  →  controller function                      │
│  • Attaches middlewares (requireAuth, upload) in the correct order     │
│  • Contains ZERO logic — purely a map of paths to handlers             │
└─────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│  CONTROLLER     (*.controller.ts)                                      │
│  ────────────────────────────────────────────────────────────────────  │
│  • Reads  req.body / req.params / req.query / req.file / req.user      │
│  • Calls exactly ONE service function                                  │
│  • Writes the response — res.send() / res.download() / res.redirect()  │
│  • NEVER touches Mongoose directly                                     │
└─────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│  SERVICE        (*.service.ts)                                         │
│  ────────────────────────────────────────────────────────────────────  │
│  • Business rules & decisions                                          │
│  • Builds query filters from raw params                                │
│  • Coordinates multi-step operations                                   │
│    (e.g. delete file from Cloudinary  →  then delete the DB record)    │
│  • NEVER touches req / res.  NEVER calls Mongoose directly              │
└─────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│  REPOSITORY     (*.repository.ts)                                      │
│  ────────────────────────────────────────────────────────────────────  │
│  • The ONLY layer that calls Mongoose                                  │
│  • .find()  .create()  .populate()  .updateOne()  .deleteOne()         │
│  • Pure data-access functions — no decisions, no business rules        │
└─────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│  MODEL          (*.model.ts)                                           │
│  ────────────────────────────────────────────────────────────────────  │
│  • Defines document shape — fields, types, defaults                    │
│  • Declares refs to other models                                       │
│    (Game.owner → User,  Review.game → Game,  Review.user → User)       │
└─────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │      MongoDB      │
                          └──────────────────┘
```

**Cross-cutting middlewares** wrap routes as needed and sit outside this vertical pipeline:

```
┌──────────────────────────────────────────────────────────────────────┐
│  requireAuth.ts    Fetches JWKS from the frontend, verifies incoming  │
│                     JWT (signature + issuer + expiry), sets req.user  │
├──────────────────────────────────────────────────────────────────────┤
│  upload.ts          Multer memory storage — hands req.file.buffer to  │
│                     the controller for direct Cloudinary streaming    │
├──────────────────────────────────────────────────────────────────────┤
│  errorHandler.ts    Centralized error → JSON response formatting      │
└──────────────────────────────────────────────────────────────────────┘
```

**Module responsibility table:**

| Module | Responsibility |
|---|---|
| `game/` | Full CRUD, search/filter, Cloudinary upload + redirect-download, download count increment |
| `user/` | Read-only mirror of better-auth's user collection — list & detail views |
| `review/` | CRUD for game reviews, linked to both `Game` and `User` via `.populate()` |
| `downloadHistory/` | Records every download event per user, exposed via a history-lookup endpoint |

---

## 📁 Project Structure

```
src/
├── config/
│   └── db.ts                  # MongoDB connection
├── middlewares/
│   ├── requireAuth.ts          # JWKS-based JWT verification
│   ├── upload.ts                 # multer memory storage
│   └── errorHandler.ts
├── modules/
│   ├── game/
│   │   ├── game.model.ts
│   │   ├── game.repository.ts
│   │   ├── game.service.ts
│   │   ├── game.controller.ts
│   │   └── game.routes.ts
│   ├── user/
│   │   ├── user.model.ts
│   │   ├── user.repository.ts
│   │   ├── user.service.ts
│   │   ├── user.controller.ts
│   │   └── user.routes.ts
│   ├── review/
│   │   ├── review.model.ts
│   │   ├── review.repository.ts
│   │   ├── review.service.ts
│   │   ├── review.controller.ts
│   │   └── review.routes.ts
│   └── downloadHistory/
│       ├── downloadHistory.model.ts
│       ├── downloadHistory.repository.ts
│       ├── downloadHistory.service.ts
│       ├── downloadHistory.controller.ts
│       └── downloadHistory.routes.ts
├── routes/
│   └── index.ts                # combines all module routes under /api
├── app.ts                      # Express app, CORS, root health route
└── server.ts                   # entry point — dotenv, connectDB, app.listen
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string

CLIENT_URL=https://your-deployed-frontend-url.vercel.app
AUTH_SERVER_URL=https://your-deployed-frontend-url.vercel.app

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> Never commit `.env` to version control.
>
> ⚠️ `AUTH_SERVER_URL` must exactly match `BETTER_AUTH_URL` on the **client** — this is the URL this server fetches `/api/auth/jwks` from to verify every incoming token. A mismatch here is the most common cause of unexplained `401 Unauthorized` responses.
>
> ⚠️ Cloudinary's free tier blocks public delivery of `.zip`/archive files by default — enable **"Allow delivery of PDF and ZIP files"** under Cloudinary Dashboard → Settings → Security, or downloads will fail even after a successful upload.

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/nihalxofficial/Stash-Server.git
cd Stash-Server

# Install dependencies
npm install

# Start development server
npm run dev
```

Server runs on [http://localhost:5000](http://localhost:5000) — visiting `/` should return:
```json
{ "message": "Stash server is running ✅" }
```

Build & run compiled output:
```bash
npm run build
npm start
```

> The [Stash-Online-Gaming-Site](https://github.com/nihalxofficial/Stash-Online-Gaming-Site) client must be running (or its `BETTER_AUTH_URL`/JWKS endpoint reachable) for any protected route to authenticate successfully.

---

## 🔐 Notes on Auth Architecture

This server does **not** share a database, session store, or codebase with its frontend counterpart. The only contract between them:

1. The client (Stash-Online-Gaming-Site) authenticates users via better-auth and issues signed JWTs through its JWT plugin.
2. Every protected request to this server carries `Authorization: Bearer <token>`.
3. `requireAuth.ts` fetches the client's public signing keys from `${AUTH_SERVER_URL}/api/auth/jwks` (cached automatically by `jose-cjs`'s `createRemoteJWKSet`) and verifies the token's **signature**, **issuer**, and **expiry** independently — it never queries the client's database or session store directly.

This means the two services can be deployed, scaled, or even rewritten independently of one another, as long as the JWKS contract stays intact.

---

## ☁️ Notes on File Storage

Game installer files are never written to this server's local disk — multer uses `memoryStorage()`, buffering the upload entirely in RAM before streaming it directly to Cloudinary as a `raw` resource type. This is a deliberate choice, not an optimization:

- **Serverless filesystems are ephemeral** — platforms like Vercel provide read-only (or request-scoped `/tmp`) filesystems, so any file written to local disk during one request simply won't exist for a later download request.
- **Downloads redirect, they don't stream through this server** — `res.redirect(game.filePath)` sends the browser directly to the Cloudinary URL, keeping this API stateless and avoiding unnecessary bandwidth load on the server itself.

---

## 🗺️ Roadmap

- [ ] Role/ownership checks on update & delete (currently any authenticated user can modify any game)
- [ ] Signed, short-lived download URLs instead of query-string JWTs
- [ ] Direct-to-Cloudinary pre-signed uploads to support real large game files beyond the current in-memory buffering + free-tier size caps
- [ ] Rate limiting on write endpoints

---

## 📄 License

This project is licensed under the MIT License.
