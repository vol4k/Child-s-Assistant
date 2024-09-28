from sqlalchemy import Column, String, DateTime
from tools.Base import Base


class Task(Base):
    __tablename__ = 'task'

    uuid = Column('uuid', String(), primary_key=True)
    title = Column('title', String())
    section_uuid = Column('section_uuid', String())
    revard = Column('revard', String())
    repeat = Column('repeat', String())
    start_date = Column('start_date', DateTime())
    image_uuid = Column('image_uuid', String())
    description = Column('description', String())

    def __init__(self, uuid, title, section_uuid, revard, repeat, start_date, image_uuid, description):
        self.uuid = uuid
        self.title = title
        self.section_uuid = section_uuid
        self.revard = revard
        self.repeat = repeat
        self.start_date = start_date
        self.image_uuid = image_uuid
        self.description = description

    def sqlSerialize(self):
        obj = {
            "uuid": self.uuid,
            "title": self.title,
            "section_uuid": self.section_uuid,
            "revard": self.revard,
            "repeat": self.repeat,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "image_uuid": self.image_uuid,
            "description": self.description,
        }

        return obj
