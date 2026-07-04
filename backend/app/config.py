from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "QuizHub API"
    DATABASE_URL: str = "sqlite:///./quizhub.db"
    SECRET_KEY: str =secret
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    MICROSOFT_CLIENT_ID: str = ""
    MICROSOFT_CLIENT_SECRET: str = ""
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"

settings = Settings()