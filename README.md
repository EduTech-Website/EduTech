# EduTech

EduTech is a fully functional EdTech platform that enables users to create, consume, and rate educational content. The platform is built using the MERN stack, which includes ReactJS, NodeJS, MongoDB, and ExpressJS.

## Introduction

EduTech aims to provide a seamless and interactive learning experience for students, making education more accessible and engaging. Additionally, the platform serves as a platform for instructors to showcase their expertise and connect with learners across the globe.

## System Architecture

The EduTech platform consists of three main components: the front-end, the back-end, and the database. The platform follows a client-server architecture, with the front-end serving as the client and the back-end and database serving as the server.

### Front-end

The front end of EduTech has all the necessary pages that an ed-tech platform should have. Some of these pages are:

**For Students:**

- **Homepage:** This page will have a brief introduction to the platform, as well as links to the course list and user details.
- **Course List:** This page will have a list of all the courses available on the platform, along with their descriptions and ratings.
- **Wishlist:** This page will display all the courses that a student has added to their wishlist.
- **Cart Checkout:** This page will allow the user to complete the course purchase.
- **Course Content:** This page will have the course content for a particular course, including videos, and other related material.
- **User Details:** This page will have details about the student's account, including their name, email, and other relevant information.
- **User Edit Details:** This page will allow the student to edit their account details.

**For Instructors:**

- **Dashboard:** This page will have an overview of the instructor's courses, as well as the ratings and feedback for each course.
- **Insights:** This page will have detailed insights into the instructor's courses, including the number of views, clicks, and other relevant metrics.
- **Course Management Pages:** These pages will allow the instructor to create, update, and delete courses, as well as manage the course content and pricing.
- **View and Edit Profile Details:** These pages will allow the instructor to view and edit their account details.

### Back-end

The back end of EduTech provides a range of features and functionalities, including:

- **User authentication and authorization:** Students and instructors can sign up and log in to the platform using their email addresses and password. The platform also supports OTP (One-Time Password) verification and forgot password functionality for added security.
- **Course management:** Instructors can create, read, update, and delete courses, as well as manage course content and media. Students can view and rate courses.
- **Payment Integration:** Students will purchase and enrol on courses by completing the checkout flow that is followed by Razorpay integration for payment handling.
- **Cloud-based media management:** EduTech uses Cloudinary, a cloud-based media management service, to store and manage all media content, including images, videos, and documents.
- **Markdown formatting:** Course content in document format is stored in Markdown format, which allows for easier display and rendering on the front end.

## Installation

To set up the EduTech platform locally, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/EduTech-Website/EduTech.git
   cd EduTech
   
2. **Install dependencies for the front-end:**

   ```sh
   npm install
   
3. **Install dependencies for the back-end:**

   ```sh
   cd server
   npm install

4. **Set up environment variables for the front-end:**

   Create a .env file in the root directory and add the following variables:
   
   ```sh
   REACT_APP_BASE_URL = http://localhost:4000/api/v1
   REACT_APP_RAZORPAY_KEY_ID = # Razorpay Key ID get from Razorpay website

6. **Set up environment variables for the back-end:**
   
   Create a .env file in the server directory and add the following variables:
   
   ```sh
   MAIL_HOST = smtp.gmail.com
   MAIL_USER = # Email user for authentication
   MAIL_PASS = # Email password for authentication
   CORS_ORIGIN = ["http://localhost:3000"]

   JWT_SECRET = # Secret key for JWT token generation
   FOLDER_NAME = # Name of the folder for storing files
   FOLDER_VIDEO = # Name of the folder for storing videos

   RAZORPAY_KEY = # API key for Razorpay payment gateway
   RAZORPAY_SECRET = # Secret key for Razorpay payment gateway

   CLOUD_NAME = # Cloudinary account name for cloud storage
   API_KEY = # API key for Cloudinary API
   API_SECRET = # API secret for Cloudinary API

   CONTACT_MAIL = # Email address for contact or support

   MONGODB_URL = # MongoDB connection URL
   PORT = 4000

8. **Start Frontend and Backend:**

   ```sh
   npm run dev

9. **Access the platform:**
   
   Open http://localhost:3000 in your web browser to access the website.

## Screenshots

### Login Page
![image](https://github.com/EduTech-Website/EduTech/assets/126242798/2e2ec752-9493-4d03-b642-0e565565ee70)

### SignUp Page
![image](https://github.com/EduTech-Website/EduTech/assets/126242798/30032bad-bc62-4ad2-9ad3-5fdec3ef4ee4)

### Home Page
![image](https://github.com/EduTech-Website/EduTech/assets/126242798/e6730edc-ca50-401e-a6bf-7c637b58a922)

### Dashboard (Instructor)
![image](https://github.com/EduTech-Website/EduTech/assets/126242798/c60b67b3-33da-4e89-8800-7311b7e7b644)

### Add Course (Instructor)
![image](https://github.com/EduTech-Website/EduTech/assets/126242798/55722c0d-9f67-4fbc-8876-91dafa6caf27)

### Enrolled Courses (Student)
![image](https://github.com/EduTech-Website/EduTech/assets/126242798/4a5f2376-3f5d-4f27-b576-52d6360d074d)

### Course Detail
![image](https://github.com/EduTech-Website/EduTech/assets/126242798/778a2f52-17ed-4502-af24-d590348d163e)
