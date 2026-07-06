import time
from celery import Celery

def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery

# For the worker, we need a celery instance at the module level.
# We'll create a dummy flask app here to initialize the worker if it's run directly.
if __name__ != '__main__':
    from flask import Flask
    import os
    app = Flask(__name__)
    app.config.update(
        CELERY_BROKER_URL=os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
        CELERY_RESULT_BACKEND=os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
    )
    celery_app = make_celery(app)

    @celery_app.task(bind=True, max_retries=3)
    def send_sms_notification(self, phone):
        try:
            print(f"[{self.request.id}] Simulating API POST request to SMS gateway for {phone}...")
            # Simulate network delay
            time.sleep(2)
            # Simulate successful send
            print(f"[{self.request.id}] Successfully sent SMS notification to {phone}")
            return {"status": "success", "phone": phone}
        except Exception as exc:
            print(f"[{self.request.id}] Error sending SMS to {phone}: {exc}. Retrying...")
            raise self.retry(exc=exc, countdown=5)
