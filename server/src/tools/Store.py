from datetime import datetime, timedelta

import calendar
from flask import jsonify
from model.Assignment import Assignment
from model.ChildProfile import ChildProfile
from model.Event import Event
from model.Image import Image
from model.ParentProfile import ParentProfile
from model.Section import Section
from model.Task import Task

from werkzeug.utils import secure_filename
from tools.Base import Base

import os
import uuid


from sqlalchemy import Float, cast, create_engine, distinct, func, or_, and_
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.exc import SQLAlchemyError


def generate_uuid():
    return str(uuid.uuid4())


FILE_DIRECTORY = os.getenv('FILE_DIRECTORY')


class Store:
    def __init__(self, config: str):
        self.engine = create_engine(config)

        if not database_exists(self.engine.url):
            create_database(self.engine.url)

        self.createTables()

        self.Session = sessionmaker(bind=self.engine)

    def createTables(self):
        Base.metadata.create_all(self.engine)

    # PARENT PROFILE

    def has_any_record(self):
        session = self.Session()
        try:
            result = session.query(ParentProfile).first()
            return result is not None
        finally:
            session.close()

    def add_or_update_credentials(self, password, sec_q, sec_a, auto_delete, week_start):
        session = self.Session()
        try:
            parent_profile = session.query(ParentProfile).first()

            if parent_profile:

                parent_profile.password = password
                parent_profile.sec_q = sec_q
                parent_profile.sec_a = sec_a
                parent_profile.auto_delete = auto_delete
                parent_profile.week_start = week_start

            else:
                parent_profile = ParentProfile(
                    uuid=generate_uuid(),
                    password=password,
                    sec_q=sec_q,
                    sec_a=sec_a,
                    auto_delete=auto_delete,
                    week_start=week_start
                )
                session.add(parent_profile)

            session.commit()
        finally:
            session.close()

    def update_password(self, new_password):
        session = self.Session()
        try:
            parent_profile = session.query(ParentProfile).first()
            parent_profile.password = new_password

            session.commit()
        finally:
            session.close()

    def update_security_question(self, sec_q, sec_a):
        session = self.Session()
        try:
            parent_profile = session.query(ParentProfile).first()

            parent_profile.sec_q = sec_q
            parent_profile.sec_a = sec_a

            session.commit()
        finally:
            session.close()

    def update_auto_delete(self, auto_delete):
        session = self.Session()
        try:
            parent_profile = session.query(ParentProfile).first()

            parent_profile.auto_delete = auto_delete

            session.commit()
        finally:
            session.close()

    def update_week_start(self, week_start):
        session = self.Session()
        try:
            parent_profile = session.query(ParentProfile).first()

            parent_profile.week_start = week_start

            session.commit()
        finally:
            session.close()

    def get_sequrity_question(self):
        session = self.Session()
        try:
            profile = session.query(ParentProfile).first()
            if (profile):
                return profile.sec_q
            else:
                raise Exception("Paretn Profile not found")
        finally:
            session.close()

    def get_secret(self):
        session = self.Session()
        try:
            profile = session.query(ParentProfile).first()
            if (profile):
                return jsonify({"sec_q": profile.sec_q, "sec_a": profile.sec_a})
            else:
                raise Exception("Paretn Profile not found")
        finally:
            session.close()

    def get_auto_delete(self):
        session = self.Session()
        try:
            profile = session.query(ParentProfile).first()
            if (profile):
                return jsonify({"auto_delete": profile.auto_delete})
            else:
                raise Exception("Paretn Profile not found")
        finally:
            session.close()

    def get_week_start(self):
        session = self.Session()
        try:
            profile = session.query(ParentProfile).first()
            if (profile):
                return {"week_start": profile.week_start}
            else:
                raise Exception("Paretn Profile not found")
        finally:
            session.close()

    def get_week_start_date(self, today: datetime):
        weekday = today.weekday()

        week_start_map = {
            'week-start-monday': 0,
            'week-start-tuesday': 1,
            'week-start-wednesday': 2,
            'week-start-thursday': 3,
            'week-start-friday': 4,
            'week-start-saturday': 5,
            'week-start-sunday': 6
        }

        week_start_key = self.get_week_start().get("week_start", "week-start-monday")
        start_day = week_start_map.get(week_start_key, 0)

        return today - timedelta(days=(weekday - start_day) % 7)

    def check_password(self, provided_password):
        session = self.Session()
        try:
            parent_profile = session.query(ParentProfile).first()
            if parent_profile:
                return parent_profile.password == provided_password
            else:
                raise Exception("Parent profile not found")
        finally:
            session.close()

    def check_security_answer(self, provided_answer):
        session = self.Session()
        try:
            parent_profile = session.query(ParentProfile).first()
            if parent_profile:
                return parent_profile.sec_a == provided_answer
            else:
                raise Exception("Parent profile not found")
        finally:
            session.close()

    def auto_delete(self):
        self.delete_unused_images()
        self.delete_old_events()


# IMAGE

    def upload_image(self, file):
        try:
            filename = secure_filename(file.filename)
            file_uuid = generate_uuid()
            file_path = os.path.join(
                FILE_DIRECTORY, file_uuid + '.' + filename.rsplit('.', 1)[1].lower())

            file.save(file_path)

            session = self.Session()
            image = Image(uuid=file_uuid, image_uri=file_path)
            session.add(image)
            session.commit()
            session.close()

            return jsonify({'uuid': file_uuid})

        except Exception as e:
            session.rollback()
            session.close()
            raise Exception(f"Error uploading image: {str(e)}")

    def get_image(self, uuid):
        session = self.Session()
        try:
            image = session.query(
                Image).filter_by(uuid=uuid).first()
            if image:
                return image.image_uri
            else:
                return None

        except Exception as e:
            raise Exception(f"Error retrieving image: {str(e)}")

        finally:
            session.close()

    def delete_image(self, uuid):
        session = self.Session()
        try:
            image = session.query(
                Image).filter_by(uuid=uuid).first()
            if image:
                image_path = os.path.join(FILE_DIRECTORY, image.image_uri)
                if os.path.isfile(image_path):
                    os.remove(image_path)
                session.delete(image)
                session.commit()
                return True
            else:
                return False

        except Exception as e:
            session.rollback()
            raise Exception(f"Error deleting image: {str(e)}")

        finally:
            session.close()

    def delete_unused_images(self):
        session = self.Session()
        try:
            images = session.query(Image).all()

            for image in images:
                is_used_in_child_profile = session.query(ChildProfile).filter_by(
                    image_uuid=image.uuid).first() is not None
                is_used_in_task = session.query(Task).filter_by(
                    image_uuid=image.uuid).first() is not None

                if not is_used_in_child_profile and not is_used_in_task:
                    self.delete_image(image.uuid)

        finally:
            session.close()

    # CHILD PROFILE

    def get_children(self):
        session = self.Session()
        try:
            profiles = session.query(ChildProfile).all()
            return jsonify([profile.sqlSerialize() for profile in profiles])
        except:
            return jsonify({"error": "Unexpected error "}), 500
        finally:
            session.close()

    def get_child_profile(self, uuid):
        session = self.Session()
        try:
            child_profile = session.query(
                ChildProfile).filter_by(uuid=uuid).first()

            if child_profile:
                return child_profile.sqlSerialize()
            else:
                raise Exception("Child profile not found")

        finally:
            session.close()

    def add_or_update_child_profile(self, uuid, name, birthday, sex, image_uuid):
        session = self.Session()
        try:
            profile = session.query(
                ChildProfile).filter_by(uuid=uuid).first()

            if profile:
                profile.name = name
                profile.birthday = birthday
                profile.sex = sex
                profile.image_uuid = image_uuid

                action = "updated"
            else:
                new_profile = ChildProfile(
                    uuid=uuid,
                    name=name,
                    birthday=birthday,
                    sex=sex,
                    image_uuid=image_uuid
                )
                session.add(new_profile)
                action = "added"

            session.commit()
            return {"message": f"Child profile {action} successfully", "status": "success"}
        except:
            session.rollback()
            return {"message": "Unexpected error", "status": "error"}

        finally:
            session.close()

    def delete_child_profile(self, uuid):
        session = self.Session()
        try:
            child_profile = session.query(
                ChildProfile).filter_by(uuid=uuid).first()

            if child_profile:
                self.delete_image(child_profile.image_uuid)
                session.delete(child_profile)
                session.commit()
                return True
            else:
                return False

        except:
            session.rollback()
            raise Exception(f"Error deleting Child's profile")

        finally:
            session.close()

    def get_statistic(self, todayStr: str, uuid=None):
        today = datetime.strptime(
            todayStr, '%Y-%m-%dT%H:%M:%S.%f').replace(hour=0, minute=0, second=0, microsecond=0)
        session = self.Session()
        try:
            results = []
            current_date = self.get_week_start_date(today)

            while current_date <= today:
                day_data = {
                    'day': current_date.isoformat(),
                    'stars': [],
                    'total_earned': float(0)
                }

                tasks = session.query(Task).filter(
                    Task.start_date > current_date,
                    Task.start_date <= current_date + timedelta(days=1)
                )

                if uuid:
                    assigned_tasks = session.query(Assignment).filter(
                        Assignment.child_profile_uuid == uuid
                    ).with_entities(Assignment.task_uuid)

                    tasks = tasks.filter(Task.uuid.in_(assigned_tasks))

                star_tasks = tasks.filter(Task.revard == '')
                money_tasks = tasks.filter(Task.revard != '')

                sections = session.query(Section).all()

                for section in sections:
                    earned_stars_query = session.query(Event).filter(
                        Event.task_uuid.in_(
                            star_tasks.with_entities(Task.uuid).filter(
                                Task.section_uuid == section.uuid
                            )
                        ),
                        func.date(Event.date) == current_date.date()
                    )

                    total_stars_query = session.query(Assignment).join(Task, Assignment.task_uuid == Task.uuid).filter(
                        Task.section_uuid == section.uuid,
                        Task.revard == '',
                        Task.start_date >= current_date,
                        Task.start_date < current_date + timedelta(days=1)
                    )

                    total_earned_query = session.query(
                        func.coalesce(
                            func.sum(func.cast(func.nullif(Task.revard, ''), Float)), 0)
                    ).select_from(Event).join(
                        Task, Event.task_uuid == Task.uuid
                    ).filter(
                        Task.uuid.in_(
                            money_tasks.with_entities(Task.uuid).filter(
                                Task.section_uuid == section.uuid
                            )
                        )
                    )

                    if uuid:
                        earned_stars_query = earned_stars_query.filter(
                            Event.child_profile_uuid == uuid)
                        total_stars_query = total_stars_query.filter(
                            Assignment.child_profile_uuid == uuid)
                        total_earned_query = total_earned_query.filter(
                            Event.child_profile_uuid == uuid)

                    earned_stars = earned_stars_query.count()
                    total_earned = total_earned_query.scalar() or 0
                    total_stars = total_stars_query.count()

                    day_data['stars'].append({
                        'section_title': section.title,
                        'earned_stars': int(earned_stars),
                        'total_stars': int(total_stars),
                    })

                    day_data['total_earned'] += total_earned

                results.append(day_data)
                current_date += timedelta(days=1)

            return jsonify(results)

        except Exception as e:
            return jsonify({'error': str(e)}), 500

        finally:
            session.close()

    # SECTION

    def get_sections(self):
        session = self.Session()
        try:
            sections = session.query(Section).order_by(
                Section.start_time).all()
            return jsonify([section.sqlSerialize() for section in sections])
        except:
            return jsonify({"error": "Unexpected error"}), 500
        finally:
            session.close()

    def get_section(self, uuid):
        session = self.Session()
        try:
            section = session.query(
                Section).filter_by(uuid=uuid).first()

            if section:
                return jsonify(section.sqlSerialize())
            else:
                raise Exception("Section not found")

        finally:
            session.close()

    def add_or_update_section(self, uuid, title, start_time, end_time):
        session = self.Session()
        try:
            section = session.query(
                Section).filter_by(uuid=uuid).first()

            if section:
                section.title = title
                section.start_time = start_time
                section.end_time = end_time
                action = "updated"
            else:
                new_section = Section(
                    uuid=uuid,
                    title=title,
                    start_time=start_time,
                    end_time=end_time
                )
                session.add(new_section)
                action = "added"

            session.commit()
            return {"message": f"Section {action} successfully", "status": "success"}
        except:
            session.rollback()
            return {"message": "Unexpected error", "status": "error"}

        finally:
            session.close()

    def delete_section(self, uuid):
        session = self.Session()
        try:
            section = session.query(
                Section).filter_by(uuid=uuid).first()

            if section:
                session.delete(section)
                session.commit()
                return True
            else:
                return False

        except:
            session.rollback()
            raise Exception(f"Error deleting Section")

        finally:
            session.close()

    # ASSIGMENT

    def add_assignments(self, task_uuid, child_profile_uuids):
        session = self.Session()
        try:
            existing_assignments = session.query(
                Assignment.child_profile_uuid
            ).filter(
                Assignment.task_uuid == task_uuid
            ).all()

            existing_profile_uuids = {
                assignment.child_profile_uuid for assignment in existing_assignments}

            profiles_to_add = set(child_profile_uuids) - existing_profile_uuids

            profiles_to_remove = existing_profile_uuids - \
                set(child_profile_uuids)

            if profiles_to_remove:
                session.query(Assignment).filter(
                    and_(
                        Assignment.task_uuid == task_uuid,
                        Assignment.child_profile_uuid.in_(profiles_to_remove)
                    )
                ).delete(synchronize_session=False)

            for profile_uuid in profiles_to_add:
                new_assignment = Assignment(uuid=generate_uuid(
                ), child_profile_uuid=profile_uuid, task_uuid=task_uuid)
                session.add(new_assignment)

            session.commit()

        except SQLAlchemyError as e:
            session.rollback()
            raise Exception(
                f"Error occurred while updating assignments for task {task_uuid}: {str(e)}")
        finally:
            session.close()

    def get_profiles_by_task(self, task_uuid):
        session = self.Session()
        try:
            profiles = session.query(
                Assignment.child_profile_uuid
            ).filter(
                Assignment.task_uuid == task_uuid
            ).all()
            return [profile.child_profile_uuid for profile in profiles]
        except:
            return {"message": "Unexpected error", "status": "error"}
        finally:
            session.close()

    def get_tasks_by_profile(self, profile_uuid):
        session = self.Session()
        try:
            tasks = session.query(
                Assignment.task_uuid
            ).filter(
                Assignment.child_profile_uuid == profile_uuid
            ).all()
            return [task.task_uuid for task in tasks]
        except:
            return {"message": "Unexpected error", "status": "error"}
        finally:
            session.close()

    # TASK

    def serialize_tasks_with_children(self, task):
        session = self.Session()
        try:
            child_uuids = session.query(Assignment.child_profile_uuid).filter(
                Assignment.task_uuid == task.uuid).all()
            child_uuids = [child_uuid[0] for child_uuid in child_uuids]

            task_data = task.sqlSerialize()
            task_data['child_uuids'] = child_uuids

            return task_data

        finally:
            session.close()

    def get_task(self, uuid):
        session = self.Session()
        try:
            task = session.query(
                Task).filter_by(uuid=uuid).first()

            if task:
                return self.serialize_tasks_with_children(task)
            else:
                raise Exception("Task not found")

        finally:
            session.close()

    def get_tasks(self, uuids):
        session = self.Session()
        try:
            query = session.query(Task).join(
                Assignment, Task.uuid == Assignment.task_uuid
            )

            query = query.filter(
                Assignment.child_profile_uuid in uuids)

            tasks = query.order_by(Task.start_date).order_by(
                Task.section_uuid).all()

            return jsonify([self.serialize_tasks_with_children(task) for task in tasks])

        except SQLAlchemyError as e:
            print(f"Error occurred while fetching tasks: {str(e)}")
            return jsonify([])

        finally:
            session.close()

    def get_tasks_with_filters(
        self,
        profile_uuid=None,
        section_uuids=[],
        start_date=None,
        tasks_type=None,
    ):
        session = self.Session()
        try:
            query = session.query(Task).outerjoin(
                Assignment, Task.uuid == Assignment.task_uuid
            )

            if tasks_type == "star":
                query = query.filter(
                    or_(Task.revard == '', Task.revard.is_(None)))
            elif tasks_type == "revard":
                query = query.filter(
                    and_(Task.revard != '', Task.revard.isnot(None)))

            if profile_uuid:
                query = query.filter(
                    Assignment.child_profile_uuid == profile_uuid)

            if start_date:
                start_date_obj = datetime.strptime(
                    start_date, '%Y-%m-%dT%H:%M:%S.%f')
                query = query.filter(
                    func.date(Task.start_date) == start_date_obj.date())

            query = query.filter(Task.section_uuid.in_(section_uuids))

            tasks = query.order_by(Task.start_date).order_by(
                Task.section_uuid).all()

            return jsonify([self.serialize_tasks_with_children(task) for task in tasks])

        except SQLAlchemyError as e:
            print(f"Error occurred while fetching tasks: {str(e)}")
            return jsonify([])

        finally:
            session.close()

    def add_or_update_task(
        self,
        uuid,
        title,
        section_uuid,
        revard,
        repeat,
        start_date,
        image_uuid,
        description,
        child_uuids
    ):
        session = self.Session()
        try:
            task = session.query(Task).filter_by(uuid=uuid).first()

            if task:
                task.uuid = uuid
                task.title = title
                task.section_uuid = section_uuid
                task.revard = revard
                task.repeat = repeat
                task.start_date = start_date
                task.image_uuid = image_uuid
                task.description = description
                self.add_assignments(uuid, child_uuids)

                action = "updated"
            else:
                new_task = Task(
                    uuid=uuid,
                    title=title,
                    section_uuid=section_uuid,
                    revard=revard,
                    repeat=repeat,
                    start_date=start_date,
                    image_uuid=image_uuid,
                    description=description
                )
                self.add_assignments(uuid, child_uuids)
                session.add(new_task)
                action = "added"

            session.commit()
            return {"message": f"Task {action} successfully", "status": "success"}
        except:
            session.rollback()
            return {"message": "Unexpected error", "status": "error"}

        finally:
            session.close()

    def delete_task(self, uuid):
        session = self.Session()
        try:
            task = session.query(Task).filter_by(uuid=uuid).first()

            if task:
                self.delete_image(task.image_uuid)
                self.add_assignments(uuid, [])
                session.delete(task)
                session.commit()
                return True
            else:
                return False

        except:
            session.rollback()
            raise Exception(f"Error deleting task")

        finally:
            session.close()

    def repeat_tasks(self):
        session = self.Session()
        try:
            current_date = datetime.now()

            tasks_to_repeat = session.query(Task).filter(
                Task.repeat != 'repeat-one-time').all()

            for task in tasks_to_repeat:
                if task.start_date <= current_date:
                    if task.repeat == 'repeat-every-day':
                        task.start_date += timedelta(days=1)
                    elif task.repeat == 'repeat-every-week':
                        task.start_date += timedelta(weeks=1)
                    elif task.repeat == 'repeat-every-month':
                        next_month = task.start_date.month % 12 + 1
                        next_year = task.start_date.year + \
                            (task.start_date.month // 12)
                        last_day_of_next_month = calendar.monthrange(
                            next_year, next_month)[1]

                        task.start_date = task.start_date.replace(
                            year=next_year,
                            month=next_month,
                            day=min(task.start_date.day,
                                    last_day_of_next_month)
                        )

                    session.add(task)

            session.commit()
        finally:
            session.close()

    # EVENT

    def get_events_with_filters(self, child_profile_uuid=None, date=None):
        session = self.Session()
        try:
            query = session.query(Event)

            if child_profile_uuid:
                query = query.filter(
                    Event.child_profile_uuid == child_profile_uuid)

            if date:
                date_obj = datetime.strptime(date, '%Y-%m-%dT%H:%M:%S.%f')
                query = query.filter(func.date(Event.date) == date_obj.date())

            events = query.order_by(Event.date.desc()).all()

            return jsonify([event.sqlSerialize() for event in events])

        except SQLAlchemyError as e:
            print(f"Error occurred while fetching events: {str(e)}")
            return jsonify([])

        finally:
            session.close()

    def get_event(self, uuid):
        session = self.Session()
        try:
            event = session.query(Event).filter_by(uuid=uuid).first()

            if event:
                return jsonify(self.serialize_tasks_with_children(event))
            else:
                raise Exception("Event not found")

        finally:
            session.close()

    def event_by_keys(self, child_profile_uuid, task_uuid):
        session = self.Session()
        try:
            event = session.query(Event).filter(
                and_(
                    Event.child_profile_uuid == child_profile_uuid,
                    Event.task_uuid == task_uuid
                )
            ).first()
            if event:
                return jsonify({"event": event.sqlSerialize()})
            else:
                return jsonify({"event": None})
        finally:
            session.close()

    def get_event_tasks(self, uuids):
        session = self.Session()
        try:
            events = session.query(Event).filter(Event.uuid.in_(uuids)).all()
            data = [
                {
                    "timestamp": event.date,
                    "child_profile_data": self.get_child_profile(event.child_profile_uuid),
                    "task_data": self.get_task(event.task_uuid)
                } for event in events]

            return jsonify(data)

        except SQLAlchemyError as e:
            print(f"Error occurred while fetching events: {str(e)}")
            return jsonify([])

        finally:
            session.close()

    def add_or_update_event(self, uuid, child_profile_uuid, task_uuid, date):
        session = self.Session()
        try:
            event = session.query(Event).filter_by(uuid=uuid).first()

            if event:
                event.uuid = uuid
                event.child_profile_uuid = child_profile_uuid
                event.task_uuid = task_uuid
                event.date = date

                action = "updated"
            else:
                new_event = Event(
                    uuid=uuid,
                    child_profile_uuid=child_profile_uuid,
                    task_uuid=task_uuid,
                    date=date
                )
                session.add(new_event)
                action = "added"

            session.commit()
            return {"message": f"Event {action} successfully", "status": "success"}
        except:
            session.rollback()
            return {"message": "Unexpected error", "status": "error"}

        finally:
            session.close()

    def delete_event(self, uuid):
        session = self.Session()
        try:
            event = session.query(Event).filter_by(uuid=uuid).first()

            if event:
                session.delete(event)
                session.commit()
                return True
            else:
                return False

        except:
            session.rollback()
            raise Exception(f"Error deleting event")

        finally:
            session.close()

    def delete_old_events(self):
        session = self.Session()
        try:
            parent_profile = session.query(ParentProfile).first()
            if not parent_profile:
                raise Exception("ParentProfile record not found")

            auto_delete_days = 0
            if parent_profile.auto_delete == 'auto-delete-45':
                auto_delete_days = 45
            elif parent_profile.auto_delete == 'auto-delete-90':
                auto_delete_days = 90
            elif parent_profile.auto_delete == 'auto-delete-180':
                auto_delete_days = 180
            elif parent_profile.auto_delete == 'auto-delete-365':
                auto_delete_days = 365
            else:
                return

            cutoff_date = datetime.now() - timedelta(days=auto_delete_days)

            old_events = session.query(Event).filter(
                Event.date < cutoff_date).all()

            for event in old_events:
                session.delete(event)

            session.commit()

        except Exception as e:
            session.rollback()
            raise Exception(f"Error deleting old events: {str(e)}")

        finally:
            session.close()
