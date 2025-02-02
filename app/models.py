from sqlalchemy import Column, Integer, String, ForeignKey #ForeignKey будет ссылаться на поле из другой таблицы 
from sqlalchemy.orm import relationship # для создания связи между полями 
from .database import Base # все наше подключение которое которое на основе наших моделей создает таблицы в БД

#To-Do
class Todo(Base):
    __tablename__ = "todo-table"

    id = Column(Integer, primary_key=True, index=True)# index=True - поиск по этому столбцу
    title = Column(String)
    description = Column(String)
    user_name = Column(String, ForeignKey("users.name"))  # Теперь внешний ключ - имя пользователя

    # Связь с моделью User
    user = relationship("User", back_populates="todos")  # Связь с задачами пользователя



#User
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)# index=True - поиск по этому столбцу
    name = Column(String)
    password = Column(String)

    todos = relationship("Todo", back_populates="user")  # Связь с задачами пользователя



# Этот файл описывает каждую табличку для БД
# на основе этого файла на основе этих классов 
# будут созданы разные таблицы в БД