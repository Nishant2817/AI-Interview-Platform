from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False, unique=True)

    logo = Column(String, nullable=True)

    category = Column(String, nullable=False)

    company_type = Column(String, nullable=True)

    headquarters = Column(String, nullable=True)

    founded = Column(String, nullable=True)

    employees = Column(String, nullable=True)

    website = Column(String, nullable=True)

    description = Column(Text, nullable=True)