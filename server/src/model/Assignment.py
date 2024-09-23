from sqlalchemy import Column, String
from tools.Base import Base


class Assignment(Base):
    __tablename__ = 'assignment'

    uuid = Column('uuid', String(), primary_key=True)
    child_profile_uuid = Column('child_profile_uuid', String())
    task_uuid = Column('task_uuid', String())

    def __init__(self, uuid, child_profile_uuid, task_uuid):
        self.uuid = uuid
        self.child_profile_uuid = child_profile_uuid
        self.task_uuid = task_uuid

    def sqlSerialize(self):
        obj = {
            "uuid": self.uuid,
            "child_profile_uuid": self.child_profile_uuid,
            "task_uuid": self.task_uuid
        }

        return obj
