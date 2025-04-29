from dotenv import load_dotenv
load_dotenv()   
import os
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from mailReAndPromt import process_query
from pydantic import BaseModel, EmailStr
from fastapi import HTTPException
app = FastAPI()

# Allow all origins (for testing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from mailling import fetch_emails,send_email
from pydantic import EmailStr
from typing import List
from fastapi.responses import JSONResponse
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.responses import FileResponse 

from apiEmailChat import generateresponse

current_dir = os.path.dirname(os.path.realpath(__file__))
file_path = os.path.join(current_dir, "youtubeinfo.txt")
print(file_path)
persist_directory = os.path.join(current_dir, 'db','chroma_db')
print(persist_directory)


@app.get("/emails")
async def generatate_reply():
    print("reached hear")
    data = fetch_emails()
    print("data",data)
    return data 

class GenerateReplyRequest(BaseModel):
    emailBody: str
    sender_email: str
    emailTime: int
    user_input: str # or whatever fields you're sending
@app.post("/generate_reply")
async def generate_reply(request: GenerateReplyRequest):
    # Use the validated request data
    print("Received data:", request)
    
    response = process_query(request.dict())  # assuming this is a function you use for processing
    body = response.get('body', '')
    subject = response.get('subject', '')
    
    return {"body": body, "subject": subject}

@app.post("/chat")
async def chat(request: str):
    response = generateresponse(request)
    print("Received data:", request)
    print("Received data:", request)
    return {"response": response}   
    
    
    
class EmailRequest(BaseModel):
    to: EmailStr
    subject: str
    body: str

@app.post('/send_mail')
def sends_mail(request: EmailRequest):
    try:
        send_email(request.subject, request.body, request.to)
        return JSONResponse(content={"success": "✅ Email sent successfully!"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""

@app.get("/")
async def get():
    return HTMLResponse(html)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
        
        