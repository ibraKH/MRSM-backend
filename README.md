# MRSM app backend

## Overview

This project is a web application designed to manage user events. Users can sign up, log in, add, view, and manage events associated with their account.

## Features

- **User Authentication:** Secure user sign up and login functionality.
- **Event Management:** Users can add, view, and manage their events.

## Technologies Used

- **Backend:** Node.js, Express.js, TypeScript
- **Testing:** Jasmine
- **Authentication:** JWT
- **Database:** PostgreSQL

## API Endpoints

- `POST /login`: endpoint for user registration.
- `POST /signup`: endpoint for user registration.
- `GET /login`: endpoint for user login page.
- `GET /signup`: endpoint for user sign up page.
- 
- `GET /events`: endpoint for displaying all events.
- `GET /event/:eventID`: endpoint for displaying one event.
- `GET /new/event`: endpoint for creating new event page.
- `POST /new/event`: endpoint for creating new event.
- 
- `GET /quiz/:quizID`: endpoint for displaying the quiz questions.
- `GET /quiz/:quizID/new/questions`: endpoint for creating new questions page.
- `POST /quiz/:quizID/new/questions`: endpoint for creating new questions.
- 
- `GET /quizzes`: endpoint for displaying all quizzes.
- `GET /new/quiz`: endpoint for creating new quiz page.
- `POST /new/quiz`: endpoint for creating new quiz.


