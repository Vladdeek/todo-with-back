from fastapi import FastAPI, HTTPException, Path, Query, Body, Depends
from typing import Optional, List, Dict, Annotated
from sqlalchemy.orm import Session
from passlib.context import CryptContext # библиотека для ХЕША паролей 

#импорт наших классов
from .models import Base, Todo, User
from .database import engine, session_local
from .schemas import TodoCreate, Todo as DbTodo, UserCreate, User as DbUser


app = FastAPI()

# Импортируем CORSMiddleware для разрешения кросс-доменных запросов
# CORS (Cross-Origin Resource Sharing) нужно, чтобы фронтенд с другого домена/порта мог отправлять запросы на наш сервер
from fastapi.middleware.cors import CORSMiddleware

# Разрешаем все источники для теста
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем все источники
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы (GET, POST, и т.д.)
    allow_headers=["*"],  # Разрешаем все заголовки
)

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") #Настройка контекста для bcrypt


# функция ХЕШИРОВАНИЯ 
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Функция для проверки пароля
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)



# функция создает сессию для подключения к ДБ
def get_db():
    db = session_local()
    try:
        yield db 
    finally:
        db.close()

#To-Do
@app.post("/todo/", response_model=DbTodo)
async def create_todo(todo: TodoCreate, db: Session = Depends(get_db)) -> DbTodo:   
    # Получаем имя пользователя из запроса (должно быть передано вместе с задачей)
    user_name = todo.user_name

    # Создаем объект задачи с именем пользователя
    db_todo = Todo(title=todo.title, description=todo.description, user_name=user_name)

    # Добавляем задачу в базу данных
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)

    return db_todo

@app.get("/todo/", response_model=List[DbTodo])
async def get_todos_by_user(username: str, db: Session = Depends(get_db)):
    # Фильтруем задачи по имени пользователя
    return db.query(Todo).filter(Todo.user_name == username).all()

@app.delete("/todo/{id}")
async def delete_todo(id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    
    db.delete(todo)
    db.commit()
    return {"message": f"Задача с id {id} была удалена"}


# Вывод всех данных
@app.get("/alltodo/", response_model=List[DbTodo])
async def todo(db: Session = Depends(get_db)):
    todos = db.query(Todo).all()  # Получаем все задачи
    return todos  # Возвращаем задачи



#Регистрация авторизация
@app.post("/users/", response_model=DbUser)
async def create_user(user: UserCreate, db: Session = Depends(get_db)) -> DbUser:   
     # Проверяем, есть ли уже пользователь с таким именем
    existing_user = db.query(User).filter(User.name == user.name).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")  
    
    # Хешируем пароль
    hashed_password = hash_password(user.password)
    
    # Создаем пользователя с хешированным паролем
    db_user = User(name=user.name, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


# Дополнительный маршрут, который будет проверять, существует ли пользователь
# Этот эндпоинт вернет {"exists": True}, если пользователь есть, и 404, если его нет.
@app.get("/users/{name}")
async def check_user(name: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.name == name).first()
    if user:
        return {"exists": True}
    raise HTTPException(status_code=404, detail="Пользователь не найден")


# Эндпоинт авторизации
@app.post("/auth/")
async def auth_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.name == user.name).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Неверный пароль")

    return {"message": "Успешный вход", "user": db_user.name}


# Вывод всех данных
@app.get("/users/", response_model=List[DbUser])
async def users(db: Session = Depends(get_db)):
    return db.query(User).all()