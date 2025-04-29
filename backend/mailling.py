

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import EmailStr
from typing import List
import imaplib
import smtplib
import email
import email.message
from email.utils import formataddr
import json
import re
from email.utils import parsedate_to_datetime
import pprint
import os
from starlette.responses import FileResponse 



# Enable CORS


# Email credentials (Replace with your credentials)
IMAP_SERVER = "imap.gmail.com"
EMAIL_ACCOUNT = "parthakadam2007@gmail.com"
APP_PASSWORD = "zvpr hvms xqag fpec"

# Function to fetch emails
def fetch_emails():
    print('in fetch mail')
    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER)
        mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
        mail.select("inbox")

        status, messages = mail.search(None, "ALL")
        email_ids = messages[0].split()
        email_list = []
        count = 1
        

        for email_id in email_ids[-15:]:  # Fetch last 10 emails
            status, msg_data = mail.fetch(email_id, "(RFC822)")
            raw_email = msg_data[0][1]
            msg = email.message_from_bytes(raw_email)
            parsed_date = parsedate_to_datetime(msg["Date"])

            sender_raw = msg["From"]
            sender_email = re.findall(r'<([^<>]+)>', sender_raw)
            sender_email = sender_email[0] if sender_email else sender_raw

            email_data = {
                'id': count,
                'email_id': int(email_id.decode()),
                "from": msg["From"],
                "subject": msg["Subject"],
                "body": extract_body(msg),
                "date": parsed_date.strftime("%Y-%m-%d"),
                "time": parsed_date.strftime("%H:%M:%S"),
                "sender_email": sender_email,
            }
         
            count += 1
            email_list.append(email_data)

        mail.close()
        mail.logout()
        return email_list

    except Exception as e:
        return [{"error": str(e)}]
    

# Function to extract email body
def send_email(subject: str, body: str, to: EmailStr):
    SMTP_SERVER = "smtp.gmail.com"
    try:
        msg = email.message.EmailMessage()
        msg["From"] = formataddr(("Your Name", EMAIL_ACCOUNT))
        msg["To"] = to
        msg["Subject"] = subject
        msg.set_content(body)

        with smtplib.SMTP_SSL(SMTP_SERVER, 465) as server:
            server.login(EMAIL_ACCOUNT, APP_PASSWORD)
            server.send_message(msg)

        print("Email sent successfully")
        return {"status": "Email sent successfully"}

    except Exception as e:
        print(f"Error: {str(e)}")
        return {"error": str(e)}


def extract_body(msg):
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                return part.get_payload(decode=True).decode()
    else:
        return msg.get_payload(decode=True).decode()
    return "No message body"
