
# from celery import shared_task
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events
from apscheduler.triggers.date import DateTrigger
from game.services import notify_tournament_users
import logging
logger = logging.getLogger(__name__)


def start_scheduler(tournament_id, trigger_time):
    logger.info(f'Start Scheduler Tournament '
                f'{tournament_id} at {trigger_time}')
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "default")
    scheduler.add_job(
        notify_tournament_users,
        args=[tournament_id],
        trigger=DateTrigger(run_date=trigger_time),
        id=f"notify_tournament_users_{tournament_id}",
        max_instances=1,
        replace_existing=True,
        misfire_grace_time=60,
        max_retries=5,
        retry_delay=60
    )
    register_events(scheduler)
    scheduler.start()
