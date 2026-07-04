from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class UserRead(BaseModel):
    id: str
    email: str
    name: Optional[str]
    picture: Optional[str]
    class Config:
        from_attributes = True

class QuestionCreate(BaseModel):
    text: str
    type: str = Field(default="single")
    difficulty: str = Field(default="easy")
    options: list = []

class OptionCreate(BaseModel):
    text: str
    is_correct: bool = False
    explanation: Optional[str] = None

class QuestionRead(BaseModel):
    id: str
    text: str
    type: str
    difficulty: str
    options: List[dict] = []
    class Config:
        from_attributes = True

class QuizCreate(BaseModel):
    user_id: str
    document_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    llm_provider: str
    questions: List[QuestionCreate] = []

class QuizRead(BaseModel):
    id: str
    title: str
    description: Optional[str]
    llm_provider: str
    document_id: Optional[str]
    created_at: datetime
    questions: List[QuestionRead] = []
    class Config:
        from_attributes = True

class DocumentRead(BaseModel):
    id: str
    title: str
    doc_type: str
    content: str
    source_url: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

class HistoryRead(BaseModel):
    id: str
    user_id: str
    quiz_id: str
    score: str
    taken_at: datetime
    quiz: Optional[QuizRead] = None
    class Config:
        from_attributes = True
