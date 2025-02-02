# Friendship Test Chat WebApp

This repository provides a complete solution for a webapp where users can join a chat room, converse in real time, and then receive an AI-generated "friend report" analyzing their conversation. The system uses:
- **Backend:** Node.js, Express, Socket.io, MongoDB
- **Frontend:** React with React Router
- **AI Integration:** OpenAI GPT-4o mini API (for conversation analysis)
- **Deployment:** Docker and Docker Compose

## Setup Instructions

1. **Clone the repository.**

2. **Backend Setup:**
   - Navigate to the `/backend` folder.
   - Create a `.env` file with:
     ```
     PORT=5000
     MONGO_URI=<Your MongoDB connection string>
     OPENAI_API_KEY=<Your OpenAI API key>
     ```
   - (Optional) Test locally with `npm install` then `npm run dev`.

3. **Frontend Setup:**
   - Navigate to the `/frontend` folder.
   - Run `npm install` to install dependencies.
   - Test locally with `npm start`.

4. **Docker Deployment:**
   - At the root folder, run:
     ```
     docker-compose up --build
     ```
   - The backend will be available on port 5000, and the frontend on port 3000.

## Usage

- Open your browser at `http://localhost:3000`.
- Enter a room name on the login page.
- In the chat room, send messages (which are broadcast via WebSocket and saved to MongoDB).
- Click the "Get Friend Report" button to generate an analysis of the conversation. You can choose the analysis role (friendship report, couple consulting, or professional mediator).

## Notes

- This is a demo implementation. In production, ensure proper user authentication, secure password handling, input validation, and encryption for data in transit and at rest.
- Adjust the OpenAI model and API parameters as needed.
- The code assumes a local MongoDB instance or a connection string provided in your `.env`.

## License

This project is provided for demonstration purposes.
