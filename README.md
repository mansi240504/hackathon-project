# Hackathon Project – Code Clash

## Overview

Code Clash is a web-based hackathon management platform designed to streamline the organization and participation process. It enables users to register, form teams, and participate in challenges, while providing organizers with tools to manage hackathons efficiently.

---

## Features

* User authentication (Signup and Login)
* Team creation and management
* Browse and participate in hackathons
* Admin and organizer dashboard
* Structured challenge management
* Responsive user interface

---

## Tech Stack

**Frontend**

* Next.js
* React.js
* CSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB

---

## Project Structure

hackathon-project/
│
├── frontend/   # Next.js frontend application
├── backend/    # Node.js backend API

---

## Getting Started

### Prerequisites

* Node.js installed
* MongoDB (local or cloud)

---

### Installation

#### Clone the repository

git clone https://github.com/mansi240504/hackathon-project.git

---

### Setup Frontend

cd frontend
npm install
npm run dev

---

### Setup Backend

cd backend
npm install
npm start

---

## Environment Variables

Create a `.env` file in the backend directory and configure the following:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

---

## Usage

* Access frontend at: http://localhost:3000
* Backend runs on configured port (e.g., http://localhost:5000)
* Users can register, login, create teams, and participate in hackathons

---

## Future Enhancements

* Real-time chat system
* Leaderboard and scoring system
* Email notifications
* Deployment optimization

---

## Author

Mansi Kashyap
GitHub: https://github.com/mansi240504

---

## License

This project is developed for educational and hackathon purposes.
