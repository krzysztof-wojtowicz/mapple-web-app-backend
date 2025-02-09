# 📍 Mapple Project

Mapple is a social media web app designed for orienteering enthusiasts. Users can share their maps and tracks with other runners, making it easier to explore, analyze, and discuss their experiences.

This project was my personal challenge to build a full-stack web application using the **MERN stack** (MongoDB, Express, React, Node.js).

![Mapple Web App Login Page](https://res.cloudinary.com/dcwp4g10w/image/upload/v1738968583/GitHub-readme/koftgd5jeclpegdlih7c.jpg)

---

## 📂 About This Repository

This repository contains the **Express.js backend** for Mapple. It handles all database operations using **Mongoose** (MongoDB ORM) and manages user authentication, post interactions, and image storage.

### Key Features:

✅ **MongoDB Database** – Stores user data and posts  
✅ **Cloudinary Integration** – Efficient image hosting and retrieval  
✅ **Nodemailer** – Sends verification emails upon account creation  
✅ **JWT Authentication** – Secures user accounts with JSON Web Tokens

---

## 🗄️ Database Structure (MongoDB)

The database consists of two main schemas:

### **📝 Post Schema**

Holds information about user posts:

- **title** – Post title
- **description** – Post details
- **image** – Cloudinary link for image storage
- **comments & likes** – User interactions
- **createdAt** – Timestamp of creation
- **other user-defined metadata** - Like useful links connected to the activity

### **👤 User Schema**

Stores user-related information:

- **name & surname** – User's full name
- **email** – Unique email address
- **password** – Encrypted password
- **profilePicture** – Link to user's avatar
- **followers & following** – Lists of connections
- **bio** – Short user description

---

## 🔌 API Endpoints

The backend provides two main sets of API routes:

### **👤 User Routes (`/api/user`)**

| Method     | Endpoint                     | Description                                                  |
| ---------- | ---------------------------- | ------------------------------------------------------------ |
| **POST**   | `/login`                     | Logs in a user using email and password                      |
| **POST**   | `/signup`                    | Creates a new user and sends a verification email            |
| **GET**    | `/verify/:token`             | Verifies a new user via a JWT token                          |
| **GET**    | `/send/:email`               | Sends an email to a user                                     |
| **GET**    | `/array/:array`              | Returns an array of users whose IDs are in the provided list |
| **GET**    | `/`                          | Retrieves all users                                          |
| **GET**    | `/:id`                       | Fetches a single user by ID                                  |
| **DELETE** | `/:id`                       | Deletes a user                                               |
| **PATCH**  | `/:id`                       | Updates user details                                         |
| **PATCH**  | `/add/follower/:user_id`     | Adds a follower to a user                                    |
| **PATCH**  | `/add/following/:user_id`    | Adds a user to the following list                            |
| **PATCH**  | `/remove/follower/:user_id`  | Removes a follower                                           |
| **PATCH**  | `/remove/following/:user_id` | Removes a user from the following list                       |

---

### **📝 Post Routes (`/api/posts`)**

| Method     | Endpoint                     | Description                                        |
| ---------- | ---------------------------- | -------------------------------------------------- |
| **GET**    | `/array/:array/:limit/:skip` | Retrieves a specific number of posts from an array |
| **GET**    | `/single/:id`                | Fetches a single post by ID                        |
| **GET**    | `/:user_id/:limit/:skip`     | Retrieves a user's posts with pagination           |
| **GET**    | `/:limit/:skip`              | Fetches posts from all users with pagination       |
| **POST**   | `/`                          | Creates a new post                                 |
| **DELETE** | `/:id`                       | Deletes a post                                     |
| **PATCH**  | `/:id`                       | Updates a post                                     |
| **PATCH**  | `/add/like/:id`              | Adds a like to a post                              |
| **PATCH**  | `/add/comment/:id`           | Adds a comment to a post                           |

---

## 📌 Technologies Used

- **MongoDB** – NoSQL database
- **Express.js** – Backend framework
- **Node.js** – JavaScript runtime
- **Mongoose** – ODM for MongoDB
- **Cloudinary** – Image hosting service
- **Nodemailer** – Email service for verification
- **JWT** – Authentication mechanism
