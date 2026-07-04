from sqlalchemy.orm import Session
from app import models, schemas

def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, email: str, name: str = None, picture: str = None, google_id: str = None, microsoft_id: str = None):
    user = models.User(email=email, name=name, picture=picture, google_id=google_id, microsoft_id=microsoft_id)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def create_document(db: Session, user_id: str, title: str, doc_type: str, content: str, source_url: str = None):
    doc = models.Document(user_id=user_id, title=title, doc_type=doc_type, content=content, source_url=source_url)
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

def get_documents(db: Session, user_id: str):
    return db.query(models.Document).filter(models.Document.user_id == user_id).all()

def create_quiz(db: Session, quiz: schemas.QuizCreate):
    db_quiz = models.Quiz(
        user_id=quiz.user_id,
        document_id=quiz.document_id,
        title=quiz.title,
        description=quiz.description,
        llm_provider=quiz.llm_provider
    )
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    for q in quiz.questions:
        db_q = models.Question(quiz_id=db_quiz.id, text=q.text, type=q.type, difficulty=q.difficulty)
        db.add(db_q)
        db.commit()
        db.refresh(db_q)
        for opt in q.options:
            db_opt = models.Option(question_id=db_q.id, text=opt["text"], is_correct=opt["is_correct"], explanation=opt.get("explanation"))
            db.add(db_opt)
        db.commit()
    return db_quiz

def get_quizzes(db: Session, user_id: str):
    return db.query(models.Quiz).filter(models.Quiz.user_id == user_id).all()

def get_quiz(db: Session, quiz_id: str):
    return db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()

def create_history(db: Session, user_id: str, quiz_id: str, score: str):
    h = models.History(user_id=user_id, quiz_id=quiz_id, score=score)
    db.add(h)
    db.commit()
    db.refresh(h)
    return h

def get_history(db: Session, user_id: str):
    return db.query(models.History).filter(models.History.user_id == user_id).all()