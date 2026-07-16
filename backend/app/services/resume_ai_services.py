import os
from dotenv import load_dotenv
from groq import Groq
import fitz
import requests

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def analyze_resume(resume_text):

    prompt = f"""
You are an expert ATS Resume Reviewer and Technical Recruiter.

Analyze the following resume.

Resume:

{resume_text}

Return the response EXACTLY in this format.

ATS Score: X/100

Strengths:
- Point 1
- Point 2
- Point 3

Weaknesses:
- Point 1
- Point 2
- Point 3

Missing Skills:
- Skill 1
- Skill 2
- Skill 3

Suggested Roles:
- Role 1
- Role 2
- Role 3

Overall Feedback:

Provide a detailed paragraph explaining how the candidate can improve this resume.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content

import re


def parse_resume_feedback(ai_response):

    ats_score = 0
    strengths = ""
    weaknesses = ""
    missing_skills = ""
    suggested_roles = ""
    overall_feedback = ""

    ats_match = re.search(
        r"ATS Score:\s*(\d+)/100",
        ai_response
    )

    if ats_match:
        ats_score = int(ats_match.group(1))

    strengths_match = re.search(
        r"Strengths:(.*?)(Weaknesses:)",
        ai_response,
        re.DOTALL
    )

    if strengths_match:
        strengths = strengths_match.group(1).strip()

    weaknesses_match = re.search(
        r"Weaknesses:(.*?)(Missing Skills:)",
        ai_response,
        re.DOTALL
    )

    if weaknesses_match:
        weaknesses = weaknesses_match.group(1).strip()

    skills_match = re.search(
        r"Missing Skills:(.*?)(Suggested Roles:)",
        ai_response,
        re.DOTALL
    )

    if skills_match:
        missing_skills = skills_match.group(1).strip()

    roles_match = re.search(
        r"Suggested Roles:(.*?)(Overall Feedback:)",
        ai_response,
        re.DOTALL
    )

    if roles_match:
        suggested_roles = roles_match.group(1).strip()

    feedback_match = re.search(
        r"Overall Feedback:(.*)",
        ai_response,
        re.DOTALL
    )

    if feedback_match:
        overall_feedback = feedback_match.group(1).strip()

    return {
        "ats_score": ats_score,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "missing_skills": missing_skills,
        "suggested_roles": suggested_roles,
        "overall_feedback": overall_feedback,
    }
def extract_resume_text(resume_url):

    response = requests.get(resume_url)

    if response.status_code != 200:
        raise Exception("Failed to download resume.")

    pdf = fitz.open(
        stream=response.content,
        filetype="pdf"
    )

    text = ""

    for page in pdf:
        text += page.get_text()

    pdf.close()

    return text