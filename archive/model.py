from Base import Session, engine, Base
from User import User
from course import Course
from datetime import date, datetime, timedelta
import json

# create database schema
Base.metadata.create_all(engine)

class DBHandler():
    def __init__(self):
        # create a new session
        self.session = Session()

    def __del__(self):
        self.session.close()


# User
    def addUser(self, name, email, password):
        obj = User(name, email, password)
        self.session.add(obj)
        self.session.commit()

    def getUser(self, email,password):
        obj = self.session.query(User).filter_by(
            user_email=email, user_password=password).first()
        return obj

    def getCourse(self):
        obj = self.session.query(Course).all()
        return obj

    def addRestaurant(self, name):
        obj = Course(name)
        self.session.add(obj)
        self.session.commit()

