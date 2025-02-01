from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQL_DB_URL = 'sqlite:///./data/database.db'

engine = create_engine(SQL_DB_URL, connect_args={"check_same_thread": False})

session_local = sessionmaker(autoflush=False, autocommit=False,bind=engine)

Base = declarative_base()



#Здесь описано подключение к базе данных 
#Разные СУБД разное подключение 
#Но это не меняет сути здесь описано именно подключение к БД