#AI Clone CLONEFLOW

## Overview
CloneFlow is an tool which solves the problem of generating context aware email 
and replys.It is also integrated with google meet and google calendar
The application aims to END repetative task of writing email 

## Key Features
- **Inbox**: Seamlessly gives an AI ppowerd email interface to be more productive
  and aqurate.
  -**Google Meet smart agent**: Makes the summery of google meet attended and summarises ,schedule, draught emails on the content discussed in the meeting.
  ** Integrated Google calendar**: Use to schedule meetings events
  -**Context Aware (RAG)**: Uses RAG  to generate context aware responses.
  -** Chetbot**: Chatbot can send emails,schedule meetings ,events with context aware response
## Future Features
- **Two-Factor Authentication (2FA)**: Adds an extra layer of security during login and transactions.
- **Advanced Encryption Standards**: Employs AES-256 encryption for top-tier security of user data.
- - **Cross-Platform Support**: Available as a Chrome Extension, Android App, and Web Interface.

    
 ## Technical Information
 ### Frontend
 - **Web Application**: Built using React, with components, pages, services, and custom hooks for state management.
### Backend
- **FastAPI**: The backend is built using FastAPI for high performance and scalability.
- **lanchain langgraph**:For Agent and making agentic pipelines.
  
## Setup Instructions
1. **Clone the Repository**: 
   ```bash
   git clone https://github.com/parthakadam2007/CloneFlow
   cd CloneFlow
   ```

2. **Frontend Setup**:
   - Navigate to the `client/web` directory and install dependencies:
     ```bash
     cd CloneFlow
     npm install
     ```

3. **Backend Setup**:
   - Navigate to the `server` directory and install dependencies:
     ```bash
     cd backend
     pip install -r requirements.txt
    
     ```
4. **Environment Variables**: Create a `.env` file in the `backend` directory and configure your environment variables.
 
5. **Run the Applications**:
   - Start the backend server:
     ```bash
     fastapi dev main.py
     ```
   - Start the frontend applications as per their respective instructions.
     
## Contribution
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.






