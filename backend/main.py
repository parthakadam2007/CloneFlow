

from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
app = FastAPI()
from mailling import fetch_emails,send_email
from pydantic import EmailStr
from typing import List

from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.responses import FileResponse 

current_dir = os.path.dirname(os.path.realpath(__file__))
file_path = os.path.join(current_dir, "youtubeinfo.txt")
print(file_path)
persist_directory = os.path.join(current_dir, 'db','chroma_db')
print(persist_directory)



# app.mount("/static", StaticFiles(directory="static"), name="static")


templates = Jinja2Templates(directory="templates")

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>email</h1>
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
    print("hello")
    return HTMLResponse(html)

@app.get("/send")
async def sendemail(subject: str, body: str, to: EmailStr):
# def send_email(subject: str, body: str, to: EmailStr):
    
    send_email(subject, body, to)
    print("sending emial")
    return {"message": "Email sent"}
    

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    emails = fetch_emails()
    await websocket.send_json(emails)
    while True:
        data = await websocket.receive_text()
        if data == "fetch":
            emails = fetch_emails()
            await websocket.send_json(emails)
        elif data == "send":
            
            await websocket.send_text("Invalid command")

