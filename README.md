# FileDrive – Cloud File Storage Backend

**FileDrive** is a secure, team-friendly backend API for cloud file storage and management.
It provides **Google OAuth 2.0 authentication**, **AWS S3-backed storage**, **hierarchical folders**, and **fine-grained access control** to build your own Google Drive–like system or add cloud file management to your apps.

---

## Features

### Authentication & Security

* Google OAuth 2.0 login with **Passport.js**
* **Role-based access control (RBAC)**: `OWNER`, `EDITOR`, `VIEWER`
* Per-user permissions at both **file** and **folder** level
* Safe streaming with MIME-aware downloads
* Duplicate prevention on uploads and folder creation

### File Management

* Upload files into AWS S3 (with access checks & duplicate prevention)
* Download files securely with streaming
* Move files to **Trash** (soft delete with `trashedAt` timestamp)
* Permanently delete files (from both **MongoDB metadata** and **S3 storage**)
* Share files with specific users (`viewer`, `editor`)
* Update permissions dynamically for shared users

### Folder Management

* Create nested folders with full path tracking
* Prevent duplicate folders at the same level
* Rename folders (permissions enforced)
* List contents (folders + files), with optional `includeTrash`
* Share folders with users (role-based)
* Update folder permissions after sharing

### Trash & Retention

* Files/folders moved to **Trash** instead of immediate deletion
* Automatic cleanup jobs with **node-cron** (configurable via `RETENTION_DAYS`)

### Developer Friendly

* **RESTful API** with clean endpoints
* Modular, extensible codebase
* Easy-to-plug-in storage driver (S3 default, but swappable)

---

## Project Structure

```
src/
├── config/         # AWS, CORS, MongoDB configs
├── constants/      # App-wide constants
├── controllers/    # API handlers for files, folders, sharing, users
├── jobs/           # Scheduled tasks (e.g., trash cleanup)
├── middleware/     # Auth, session, file upload
├── models/         # Mongoose schemas (User, File, Folder, etc.)
├── routes/         # Express routers
├── services/       # Access control & sharing logic
├── storage/        # S3 driver
├── utils/          # Logger, DB connection, passport setup
server.js           # Main server entry point
```

---

## Tech Stack

* **Node.js** + **Express.js** – REST API server
* **MongoDB** + **Mongoose** – Data persistence
* **AWS S3** – File storage
* **Multer** – File upload middleware
* **Passport.js** – Google OAuth 2.0 auth
* **node-cron** – Trash cleanup jobs
* **pino** – logging

---

## Getting Started

### 1. Clone the repository

```
git clone https://github.com/mohankumarkadiri/File-Drive.git
cd File-Drive
```

### 2. Install dependencies

```
yarn install
```

### 3. Configure environment variables

Create a `.env` file:

```
SERVER_PORT=17291
SESSION_SECRET=your-session-secret
MONGO_USERNAME=your-mongo-username
MONGO_PASSWORD=your-mongo-password
MONGO_HOST=your-mongo-host
MONGO_DB_NAME=FileDrive
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AWS_REGION=your-aws-region
AWS_BUCKET_NAME=your-s3-bucket
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
BASE_URL=https://localhost:17291
RETENTION_DAYS=30
PRODUCTION_ENV=false
LOG_LEVEL=info
```

### 4. Start the server

```
yarn dev
```

Server runs at: [https://localhost:17291](https://localhost:17291)

---

## Roadmap

* [ ] Add file versioning
* [ ] Public shareable links with expiration
* [ ] Advanced Search (text, metadata)
---

## License

MIT – feel free to fork, modify, and contribute!
