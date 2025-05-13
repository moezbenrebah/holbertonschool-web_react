# 📸 ShutterUp

This is the backend for **ShutterUp**, a photo sharing application where users can upload, manage, and organize photos in galleries securely.

---

## 🚀 Features

- User Registration and Login with JWT Authentication
- Email Verification System
- Secure Image Uploads to Cloudinary
- Create/Delete Posts (Photos)
- Create/Delete Galleries
- Add Photos to Galleries
- RESTful API with Express.js and MongoDB

---

## 🛠️ Technologies Used Backend

| Tech        | Purpose                                |
|-------------|----------------------------------------|
| Node.js     | JavaScript runtime                     |
| Express.js  | Web framework for Node.js              |
| MongoDB     | NoSQL database                         |
| Mongoose    | ODM to interact with MongoDB           |
| JWT         | Authentication via tokens              |
| Bcrypt      | Password hashing                       |
| Cloudinary  | Image hosting & transformation         |
| dotenv      | Manage environment variables           |
| express-fileupload | Handle file uploads             |
| CORS        | Handle cross-origin requests           |

---

## 📁 Folder Structure

```bash

├── config/             # Cloudinary & DB config
├── controllers/        # Business logic (auth, post, gallery)
├── middleware/         # JWT auth middleware
├── models/             # Mongoose schemas
├── routes/             # API endpoints
├── utils/              # Reusable helpers (e.g. Cloudinary upload)
├── .env                # Environment variables (JWT_SECRET, etc)
├── server.js           # Entry point

---

### 📦 Install Dependencies

npm install

---

### ▶️ Run the Server

npm start 
- The server will start on http://localhost:5000 by default
---



# ShutterUp

start frontend: npm run dev

startbackend: npm start