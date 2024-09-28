from sqlalchemy import Column, DateTime, String
from tools.Base import Base


class Event(Base):
    __tablename__ = 'event'

    uuid = Column('uuid', String(), primary_key=True)
    child_profile_uuid = Column('child_profile_uuid', String())
    task_uuid = Column('task_uuid', String())
    date = Column('date', DateTime())

    def __init__(self, uuid, child_profile_uuid, task_uuid, date):
        self.uuid = uuid
        self.child_profile_uuid = child_profile_uuid
        self.task_uuid = task_uuid
        self.date = date

    def sqlSerialize(self):
        obj = {
            "uuid": self.uuid,
            "child_profile_uuid": self.child_profile_uuid,
            "task_uuid": self.task_uuid,
            "date": self.date.isoformat() if self.date else None,
        }

        return obj
