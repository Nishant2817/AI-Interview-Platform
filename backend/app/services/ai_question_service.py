import os
import json

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def clean_json_response(content: str):
    """
    Removes markdown code blocks if Groq returns them.
    """

    content = content.strip()

    if content.startswith("```json"):
        content = content.replace("```json", "", 1)

    if content.startswith("```"):
        content = content.replace("```", "", 1)

    if content.endswith("```"):
        content = content[:-3]

    return content.strip()


def generate_questions(request):

    prompt = f"""
You are a Senior Interviewer working at {request.company}.

Your responsibility is to conduct a REAL interview exactly like interviewers inside the company.

Candidate Details

Company:
{request.company}

Interview Type:
{request.interview_type}

Role:
{request.role}

Experience:
{request.experience_level}

Difficulty:
{request.difficulty}

Generate exactly {request.question_count} questions.

-------------------------------------------------------

Interview Rules

The interview should feel like a REAL interview conducted by {request.company}.

Questions must be tailored according to

• Company

• Role

• Experience

• Difficulty

-------------------------------------------------------

If Interview Type is TECHNICAL

Generate questions only from topics related to the selected role.

Example

Frontend Developer

React
JavaScript
HTML
CSS
Redux
REST APIs
Performance
Browser Rendering

Backend Developer

Python
FastAPI
Node
Authentication
JWT
REST APIs
Databases
Caching

Full Stack Developer

React
JavaScript
Python
FastAPI
Authentication
REST APIs
PostgreSQL
MongoDB
Redis
Git

DevOps

Docker
Linux
CI/CD
AWS
Azure
Redis
Nginx

-------------------------------------------------------

If Interview Type is HR

Generate HR interview questions only.

-------------------------------------------------------

If Interview Type is Behavioral

Generate behavioral questions only.

-------------------------------------------------------

If Interview Type is Non Technical

Generate interview questions related to the selected role only.

-------------------------------------------------------

Question Distribution

30% MCQ

70% Descriptive

Never generate coding questions.

Never generate system design questions.

Never generate aptitude questions.

-------------------------------------------------------

Difficulty Rules

Easy

Basic concepts

Medium

Conceptual understanding

Scenario based

Hard

Advanced conceptual interview questions

-------------------------------------------------------

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations.

JSON Format

{{
    "questions":[
        {{
            "id":1,
            "type":"mcq",
            "topic":"React",
            "difficulty":"Easy",
            "question":"Question",
            "options":[
                "Option A",
                "Option B",
                "Option C",
                "Option D"
            ],
            "correct_answer":"Option A"
        }},
        {{
            "id":2,
            "type":"text",
            "topic":"JavaScript",
            "difficulty":"Medium",
            "question":"Question"
        }}
    ]
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.5,
    )

    content = response.choices[0].message.content

    cleaned_content = clean_json_response(content)

    questions = json.loads(cleaned_content)

    return {
    "company": request.company,
    "interview_type": request.interview_type,
    "role": request.role,
    "experience_level": request.experience_level,
    "difficulty": request.difficulty,
    "duration": request.duration,
    "question_count": request.question_count,
    "questions": questions["questions"]
}