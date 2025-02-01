from sqlalchemy import Column, Integer, String, ForeignKey #ForeignKey будет ссылаться на поле из другой таблицы 
from sqlalchemy.orm import relationship # для создания связи между полями 
from .database import Base # все наше подключение которое которое на основе наших моделей создает таблицы в БД

#To-Do
class Todo(Base):
    __tablename__ = "todo-table"

    id = Column(Integer, primary_key=True, index=True)# index=True - поиск по этому столбцу
    title = Column(String)
    description = Column(String)


#User
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)# index=True - поиск по этому столбцу
    name = Column(String)
    password = Column(String)



# Этот файл описывает каждую табличку для БД
# на основе этого файла на основе этих классов 
# будут созданы разные таблицы в БД