import atexit
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from flask_cors import CORS
from tools.Store import Store
from flask import Flask
from dotenv import load_dotenv
import os
import sys
sys.dont_write_bytecode = True


class Config:
    SCHEDULER_API_ENABLED = True


router = Flask(__name__)
CORS(router)

router.config.from_object(Config)

load_dotenv()

router.config['SQLALCHEMY_DATABASE_URI'] = "{dialect}://{user}:{password}@{address}:{port}/{db_name}".format(
    dialect=os.getenv('DB_DIALECT'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    address=os.getenv('DB_ADDRESS'),
    port=os.getenv('DB_PORT'),
    db_name=os.getenv('DB_NAME')
)

store = Store(router.config['SQLALCHEMY_DATABASE_URI'])

scheduler = BackgroundScheduler()
scheduler.start()

scheduler.add_job(
    func=store.auto_delete,
    trigger=CronTrigger(hour=0, minute=0),
    id='auto_delete',
    name='Auto Delete',
    replace_existing=True)

scheduler.add_job(
    func=store.repeat_tasks,
    trigger=CronTrigger(hour=0, minute=0),
    id='repeat_tasks',
    name='Repeat Tasks',
    replace_existing=True
)

atexit.register(lambda: scheduler.shutdown())

from routes.ParentProfileRoutes import *
from routes.ImageRoutes import *
from routes.ChildProfileRoutes import *
from routes.SectionRoutes import *
from routes.TaskRoutes import *
from routes.EventRoutes import *