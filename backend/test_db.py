from app.database import Base, engine
from app.models.user import User
from app.models.profile import Profile


Base.metadata.create_all(bind=engine)

print("Tables Created")
