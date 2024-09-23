from sqlalchemy import Column, String
from tools.Base import Base


class Image(Base):
    __tablename__ = 'image'

    uuid = Column('uuid', String(), primary_key=True)
    image_uri = Column('image_uri', String())
    
    def __init__(self, uuid, image_uri):
        self.uuid = uuid
        self.image_uri = image_uri

    def sqlSerialize(self):
        obj = {
            "uuid": self.uuid,
            "image_uri": self.image_uri,
        }

        return obj
