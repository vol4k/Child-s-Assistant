from sqlalchemy import Column, String
from tools.Base import Base


class ParentProfile(Base):
    __tablename__ = 'parent_profile'

    uuid = Column('uuid', String(), primary_key=True)
    password = Column('password', String())
    sec_q = Column('sec_q', String())
    sec_a = Column('sec_a', String())
    auto_delete = Column('auto_delete', String())
    week_start = Column('week_start', String())

    def __init__(self, uuid, password, sec_q, sec_a, auto_delete, week_start):
        self.uuid = uuid
        self.password = password
        self.sec_q = sec_q
        self.sec_a = sec_a
        self.auto_delete = auto_delete
        week_start = week_start

    def sqlSerialize(self):
        obj = {
            "uuid": self.uuid,
            "password": self.password,
            "sec_q": self.sec_q,
            "sec_a": self.sec_a,
            "auto_delete": self.auto_delete,
            "week_start": self.week_start
        }

        return obj
