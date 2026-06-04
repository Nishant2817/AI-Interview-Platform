from app.database import Base, engine
from app.models.user import User

print(Base.metadata.tables.keys())

Base.metadata.create_all(bind=engine)

print("Tables Created")
