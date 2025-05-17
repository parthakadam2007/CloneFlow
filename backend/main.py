from dotenv import load_dotenv
load_dotenv()   
import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect,UploadFile, File,Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from mailReAndPromt import process_query
from pydantic import BaseModel, EmailStr
from fastapi import HTTPException
from sendGenertor import send_process_query
import shutil
from ragUploder import upload_Embeddings , storing_vector_user_settings,user_settings_export
from typing import List

from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from werkzeug.utils import secure_filename
import json
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
from cvsToText import parse_vcf_natural_without_photo

current_dir = os.path.dirname(os.path.realpath(__file__))
file_path = os.path.join(current_dir, "youtubeinfo.txt")
persist_directory = os.path.join(current_dir, 'db','chroma_db')


@app.get("/emails")
async def generatate_reply():
    data = fetch_emails()
    return data 

class GenerateReplyRequest(BaseModel):
    humanRequest: str
    emailBody: str
    sender_email: str
    emailTime: int
    user_input: str # or whatever fields you're sending
    
@app.post("/generate_reply")
async def generate_reply(request: GenerateReplyRequest):
    # Use the validated request data
    response = process_query(request.dict())  # assuming this is a function you use for processing
    body = response.get('body', '')
    subject = response.get('subject', '')
    return {"body": body, "subject": subject}


class GenerateComposeRequest(BaseModel):
    to:str
    subject:str
    message:str
    promtToMail:str
@app.post("/generate_compose")
async def generate_compose(request: GenerateComposeRequest):
    # Use the validated request data
    response = send_process_query(request.dict())  # assuming this is a function you use for processing
    body = response.get('body', '')
    subject = response.get('subject', '')
    return {"body": body, "subject": subject}

class ChatRequest(BaseModel):
    message: str
@app.post("/chat")
async def chat(request: ChatRequest):
    response = generateresponse(request.message)
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

class ComposeRequest(BaseModel):
    to: EmailStr
    subject: str
    message: str
@app.post('/compose')
def sends_mail(request: ComposeRequest):
    try:
        
        send_email(request.subject, request.message, request.to)
        return JSONResponse(content={"success": "✅ Email sent successfully!"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
    


@app.get("/")
async def get():
    return "hello world"



# @app.post("/uploadRecording")
# async def upload_video(file: UploadFile = File(...)):
#     with open("received.webm", "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)
#     return {"message": "Video uploaded successfully"}


import logging
# Constants
UPLOAD_FOLDER = "backend/uploads"
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'xlsx', 'csv', 'docx','vcf'}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Add session middleware for flashing messages
app.add_middleware(SessionMiddleware, secret_key='your_secret_key')

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.post("/uploadFiles")
async def upload_files(request: Request, files: List[UploadFile] = File(...)):
    uploaded_files = []

    for file in files:
        if file.filename == '':
            logging.warning('One or more files have no filename.')
            continue

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)
            uploaded_files.append(filename)
            logging.info(f"File '{filename}' uploaded successfully.")

    if uploaded_files:
        # You can simulate flashing using session or just log/print
        logging.info(f"Success! Uploaded files: {', '.join(uploaded_files)}")
        upload_Embeddings()  # Call your embeddings function
        logging.info('Embeddings generated successfully.')
    else:
        logging.error('No valid files uploaded.')

    return {"message": "Files uploaded successfully", "files": uploaded_files}
# ###########################################################################################################


USERS_SETTING_UPLOAD = "backend/user_settings"
os.makedirs(USERS_SETTING_UPLOAD, exist_ok=True)

class UserSettingsRequest(BaseModel):
    formData: dict
    instruction: str   
@app.post("/uploadUserSettings")
async def upload_user_settings(request:UserSettingsRequest):
    if not request:
        raise HTTPException(status_code=400, detail="No User Settings")
    else:
        print("request",request)
    
    
    if os.path.exists("backend/user_settings.json"):
      print("Dumping to JSON file:", request.dict())
      print()
      print("File exists!")
    else:
      print("File does not exist.")
        
    with open("backend/user_settings.json", "w") as f:
        print("request.dict()",request.dict())
        json.dump(request.dict(), f, indent=4)
           
        
    with open(r"backend/user_settings/user_info.txt", "w") as f:
        f.write(str(request.formData))
    
    with open(r"backend/user_settings/instruction.txt", "w") as f:
        f.write(str(request.instruction))
        
    user_settings_export()
    
    return {"message": "User settings uploaded successfully"}
        
        
    
@app.post("/uploadContact")
async def upload_contact(request:Request,files: List[UploadFile] = File(...)):
    uploaded_files = []

    for file in files:
        if file.filename == '':
            logging.warning('One or more files have no filename.')
            continue

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(USERS_SETTING_UPLOAD, filename)
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)
            uploaded_files.append(filename)
            logging.info(f"File '{filename}' uploaded successfully.")

    if uploaded_files:
   
        logging.info(f"Success! Uploaded files: {', '.join(uploaded_files)}")
        parse_vcf_natural_without_photo(file_path)
        user_settings_export()
        
@app.get("/user_settings_get")
async def get_user_settings():
    try:
       
        with open(r"backend/user_settings.json", "r") as f:
            data = json.load(f)  # Parse JSON into a Python dictionary
            print("data",data)
        return data  # FastAPI will automatically convert this to JSON response
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="User settings file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding JSON from user settings file")