import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def evaluate_interview(question, answer):

    prompt = f"""
You are an expert technical interviewer.

Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer.

Return in exactly this format:

Score: X/10

Strengths:
- Point 1
- Point 2

Improvements:
- Point 1
- Point 2

Ideal Answer:
Provide a concise and technically correct interview answer.
Use bullet points for readability.

Rules:
- Do not write any introduction.
- Do not write any conclusion.
- Use exactly the headings above.
- Do not change the heading names.
- Do not add extra sections.
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

def parse_feedback(ai_response):

    score = 0
    strengths = ""
    improvements = ""
    ideal_answer =""

    score_match = re.search(
        r"Score:\s*(\d+)/10",
        ai_response
    )

    if score_match:
        score = int(score_match.group(1))

    strengths_match = re.search(
        r"Strengths:(.*?)(Improvements:)",
        ai_response,
        re.DOTALL
    )

    if strengths_match:
        strengths = strengths_match.group(1).strip()

    improvements_match = re.search(
        r"Improvements:(.*?)(Ideal Answer:)",
        ai_response,
        re.DOTALL
    )

    if improvements_match:
        improvements = improvements_match.group(1).strip()
    
    ideal_match = re.search(
        r"Ideal Answer:(.*)",
        ai_response,
        re.DOTALL
    )
    if ideal_match:
        ideal_answer = ideal_match.group(1).strip()

    return {
        "score": score,
        "strengths": strengths,
        "improvements": improvements,
        "ideal_answer": ideal_answer
    }

    




