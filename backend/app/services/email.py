import os

from dotenv import load_dotenv

from fastapi_mail import (
    FastMail,
    MessageSchema,
    ConnectionConfig
)

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("SMTP_EMAIL"),
    MAIL_PASSWORD=os.getenv("SMTP_PASSWORD"),
    MAIL_FROM=os.getenv("SMTP_EMAIL"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

async def send_reset_email(email:str,reset_link:str):
    message = MessageSchema(
        subject="Password Reset",
        recipients=[email],
        body=f"""
Click the link below to reset your password:

{reset_link}
""",
        subtype="plain"
    )

    fm = FastMail(conf)

    await fm.send_message(message)