# -backend-task-manager
This is the backend for a Task Manager application that allows users to register, log in, and manage tasks. The API is built using Node.js and Express, and it interacts with a MongoDB database.

Backend README.md
# Task Manager API (Backend)

## Overview
This is the backend for a Task Manager application that allows users to register, log in, and manage tasks. The API is built using Node.js and Express, and it interacts with a MongoDB database.

## Features
- User authentication (register, login, logout)
- CRUD operations for tasks
- JWT-based authorization
- API for communication with the frontend

## Technologies
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)

## Installation

1. Clone the repository:

   bash
   git clone [https://your-repo-url.git](https://github.com/Masngo/-backend-task-manager.git ) 
   cd backend-task-manager
2.	Install the dependencies:
3.	npm install
4.	Create a .env file in the root directory and add your environment variables:
5.	MONGO_URI=your_mongo_db_connection_string
6.	PORT=5000
7.	JWT_SECRET=your_jwt_secret
8.	Start the server:
9.	npm start
10.	The API will be available at http://localhost:5000/api.

API Endpoints

User Authentication

•	POST /users/register: Register a new user

•	POST /users/login: Log in an existing user

•	POST /users/logout: Log out the current user

Task Management

•	GET /tasks: Fetch all tasks

•	POST /tasks: Create a new task

•	PUT /tasks/:id: Update an existing task

•	DELETE /tasks/:id: Delete a task

## Screenshots

<img width="1286" height="710" alt="backend-task-manager" src="https://github.com/user-attachments/assets/0f8eddf1-e30b-40be-9b92-8062e9407128" />


<img width="1352" height="721" alt="backend-task-manager1" src="https://github.com/user-attachments/assets/914bd045-a632-4f94-9d7a-a9542eb546ec" />


Contributing

1.	Fork the repository
2.	Create a feature branch (git checkout -b feature/YourFeature)
3.	Commit your changes (git commit -m 'Add some feature')
4.	Push to the branch (git push origin feature/YourFeature)
5.	Open a pull request
License

This project is licensed under the MIT License.

