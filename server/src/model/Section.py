from sqlalchemy import Column, String
from tools.Base import Base


class Section(Base):
    __tablename__ = 'section'

    uuid = Column('uuid', String(), primary_key=True)
    title = Column('title', String())
    start_time = Column('start_time', String())
    end_time = Column('end_time', String())

    def __init__(self, uuid, title, start_time, end_time):
        self.uuid = uuid
        self.title = title,
        self.start_time = start_time
        self.end_time = end_time

    def sqlSerialize(self):
        obj = {
            "uuid": self.uuid,
            "title": self.title,
            "start_time": self.start_time,
            "end_time": self.end_time
        }

        return obj
