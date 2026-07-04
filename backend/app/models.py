import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

def gen_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_uuid)
    google_id = Column(String, unique=True, index=True, nullable=True)
    microsoft_id = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    picture = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    quizzes = relationship("Quiz", back_populates="user", cascade="all, delete-orphan")
    history = relationship("History", back_populates="user", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    title = Column(String)
    doc_type = Column(String)
    content = Column(Text)
    source_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    quiz = relationship("Quiz", back_populates="document", uselist=False)

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    document_id = Column(String, ForeignKey("documents.id"), nullable=True)
    title = Column(String)
    description = Column(Text, nullable=True)
    llm_provider = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="quizzes")
    document = relationship("Document", back_populates="quiz")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    history = relationship("History", back_populates="quiz", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"
    id = Column(String, primary_key=True, default=gen_uuid)
    quiz_id = Column(String, ForeignKey("quizzes.id"))
    text = Column(Text)
    type = Column(String)
    difficulty = Column(String)
    quiz = relationship("Quiz", back_populates="questions")
    options = relationship("Option", back_populates="question", cascade="all, delete-orphan")

class Option(Base):
    __tablename__ = "options"
    id = Column(String, primary_key=True, default=gen_uuid)
    question_id = Column(String, ForeignKey("questions.id"))
    text = Column(Text)
    is_correct = Column(Boolean, default=False)
    explanation = Column(Text, nullable=True)
    question = relationship("Question", back_populates="options")

class History(Base):
    __tablename__ = "history"
    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    quiz_id = Column(String, ForeignKey("quizzes.id"))
    score = Column(String)
    taken_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="history")
    quiz = relationship("Quiz", back_populates="history")
