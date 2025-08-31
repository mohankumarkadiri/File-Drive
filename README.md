# FileDrive – Cloud File Storage Backend

**FileDrive** is a secure, team-friendly backend API for file storage and management in the cloud. It allows users to authenticate using Google, store files in hierarchical folders, upload/download files directly onto AWS S3, and control access and permissions at the user and folder/file level. Built for extensibility and security, FileDrive is perfect for developing your own Google Drive-like backend or adding cloud file management to your apps.

---

## Features

- **Google OAuth 2.0 Authentication**  
  Secure login using Google accounts via Passport.js.

- **Hierarchical Folder Structure**  
  Organize files in nested folders, with full path tracking and duplicate prevention at each level.

- **AWS S3 File Storage**  
  All files are uploaded and stored in your configured S3 bucket for scalability and reliability.

- **Access Control**  
  Owner-based access, per-user permissions (`viewer`/`editor`), and sharing with specific users.

- **Soft Delete & Trash**  
  Files and folders can be moved to trash (soft delete), with scheduled cleanup.

- **RESTful API**  
  Clean, well-structured endpoints for all operations.

---

## Project Structure

```
src/
├── config/         # AWS, CORS, MongoDB configs
├── constants/      # App-wide constants
├── controllers/    # API handlers for files, folders, sharing, users
├── jobs/           # Scheduled tasks (e.g., trash cleanup)
├── middleware/     # Auth, session, upload
├── models/         # Mongoose schemas (User, File, Folder, etc.)
├── routes/         # Express routers
├── services/       # Access control logic
├── storage/        # S3 driver
├── utils/          # Logger, DB connection, passport setup
server.js           # Main server entry point
```

---

## Tech Stack

- **Node.js** & **Express.js** – REST API server
- **MongoDB** & **Mongoose** – Data persistence
- **AWS S3** – File storage
- **Multer** – File upload middleware
- **Passport.js** – Google OAuth authentication
- **dotenv** – Environment variable management
- **node-cron** – Scheduled jobs (trash cleanup)
- **pino** – Logger 

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/mohankumarkadiri/File-Drive.git
cd File-Drive
```

### 2. Install dependencies
```bash
yarn install
```

### 3. Configure environment variables

Create `.env` file with your credentials:
```ini
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
```bash
yarn dev
```
The server will run on [https://localhost:17291](https://localhost:17291).

---

### Routes
<img width="336" height="637" alt="image" src="https://github.com/user-attachments/assets/e54a1397-9da5-43ee-8147-6247d17a1107" />

## License

MIT – feel free to fork, modify, and contribute!
