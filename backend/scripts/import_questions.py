import csv
import os
import sys

# Add backend folder to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.company import Company
from app.models.topic import Topic
from app.models.difficulty_level import DifficultyLevel
from app.models.question_type import QuestionType
from app.models.question import Question


db = SessionLocal()

imported = 0
skipped = 0

BASE_FOLDER = "data/companies"

def get_company_id(name):
    company = db.query(Company).filter(Company.name == name).first()
    return company.id if company else None


def get_topic_id(name):
    topic = db.query(Topic).filter(Topic.name == name).first()
    return topic.id if topic else None


def get_difficulty_id(name):
    difficulty = (
        db.query(DifficultyLevel)
        .filter(DifficultyLevel.name == name)
        .first()
    )
    return difficulty.id if difficulty else None


def get_question_type_id(name):
    question_type = (
        db.query(QuestionType)
        .filter(QuestionType.name == name)
        .first()
    )
    return question_type.id if question_type else None

for root, dirs, files in os.walk(BASE_FOLDER):

    for filename in files:

        if not filename.endswith(".csv"):
            continue

        csv_path = os.path.join(root, filename)

        print(f"\n📄 Reading {csv_path}")

        with open(csv_path, newline="", encoding="utf-8") as file:

            reader = csv.DictReader(file)

            for row in reader:

                company_id = get_company_id(row["Company"])
                topic_id = get_topic_id(row["Topic"])
                difficulty_id = get_difficulty_id(row["Difficulty"])
                question_type_id = get_question_type_id(row["QuestionType"])

                existing_question = (
                    db.query(Question)
                    .filter(
                        Question.title == row["Title"],
                        Question.company_id == company_id,
                        Question.question_type_id == question_type_id,
                    )
                    .first()
                )

                if existing_question:
                    print(f"⚠ Skipping: {row['Title']}")
                    skipped += 1
                    continue

                question = Question(
                    title=row["Title"],
                    description=row["Description"],
                    answer=row["Answer"],
                    time_complexity=row["TimeComplexity"],
                    space_complexity=row["SpaceComplexity"],
                    interview_tips=row["InterviewTip"],
                    company_id=company_id,
                    topic_id=topic_id,
                    difficulty_id=difficulty_id,
                    question_type_id=question_type_id,
                )

                db.add(question)
                skipped += 1
                imported += 1

                print(f"✅ Imported: {row['Title']}")

    

db.commit()

print("\n-------------------------")
print(f"Imported : {imported}")
print(f"Skipped  : {skipped}")
print("-------------------------")
print("✅ Import Completed!")

db.close()