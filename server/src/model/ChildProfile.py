from sqlalchemy import Column, DateTime, String
from tools.Base import Base


class ChildProfile(Base):
    __tablename__ = 'child_profile'

    uuid = Column('uuid', String(), primary_key=True)
    name = Column('name', String())
    birthday = Column('birthday', DateTime())
    sex = Column('sex', String())
    image_uuid = Column('image_uuid', String())

    def __init__(self, uuid, name, birthday, sex, image_uuid):
        self.uuid = uuid
        self.name = name
        self.birthday = birthday
        self.sex = sex
        self.image_uuid = image_uuid

    def sqlSerialize(self):
        obj = {
            "uuid": self.uuid,
            "name": self.name,
            "birthday": self.birthday.isoformat() if self.birthday else None,
            "sex": self.sex,
            "image_uuid": self.image_uuid
        }

        return obj
