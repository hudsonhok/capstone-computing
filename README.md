# WorkPlaceWise

Our project is a business dashboard web application which purpose is to help managers oversee their business and assist with various managerial duties. This project is built using React and Django. See our [project requirements wiki page](https://github.com/SCCapstone/logic-terrors/wiki/Project-Description) for more info.

## External Requirements

In order to build this project, the user will have to install:

- [Python3](https://www.python.org/downloads/)
- [Django](https://www.djangoproject.com/download/)
- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org/download/)

## Setup

The project requires installation of Django and Python packages.
Installation guides for the packages are linked below:

- https://docs.djangoproject.com/en/4.2/topics/install/
- https://www.python.org/downloads/

## Running

Make sure you're in the project directory `logic-terrors/Webapp` and run the following commands in the terminal:
`pipenv shell`
`pipenv install`
`npm i --legacy-peer-deps`
`npm run dev`

In a separate terminal run:
`pipenv shell`
`python3 manage.py makemigrations`
`python3 manage.py migrate`
`python3 manage.py runserver`

# Deployment

Deployment was based off of the instructions provided in this tutorial:https://docs.digitalocean.com/developer-center/deploy-a-django-app-on-app-platform/#step-4-deploying-to-digitalocean-with-app-platform

**Step 1:**
Set up your virtual environment:
```
pipenv shell
```

**Step 2:**
Make sure all packages for deployment are downloaded and put them in a requirements.txt document and remove the pipfile and pipfile.lock:
```
pip install django gunicorn dj-database-url pyscoppg2
```
```
pip freeze > requirements.txt
```
```
rm pipfile
```
```
rm pipfile.lock
```

**Step 3:**
Adjust the settings.py file to configure for deployment
```
import os
import sys
import dj_database_url
from django.core.management.utils import get_random_secret_key
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", get_random_secret_key())
ALLOWED_HOSTS = os.getenv("127.0.0.1,localhost", "workplace-wise-27kxy.ondigitalocean.app" ).split(",")DEBUG = os.getenv("DEBUG", "False") == "True"
DEVELOPMENT_MODE = os.getenv("DEVELOPMENT_MODE", "False") == "True"
if DEVELOPMENT_MODE is True:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
        }
    }
elif len(sys.argv) > 0 and sys.argv[1] != 'collectstatic':
    if os.getenv("DATABASE_URL", None) is None:
        raise Exception("DATABASE_URL environment variable not defined")
    DATABASES = {
        "default": dj_database_url.parse(os.environ.get("DATABASE_URL")),
    }
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")
```

**Step 4:**
Make sure all changes are pushed to github and deploy the app through DigitalOcean's App Platform.

# Testing

## Testing Technology

Unit tests were made using Django's testing framework. You can learn more about it [here](https://docs.djangoproject.com/en/4.1/topics/testing/overview/).

Behavior tests were created using the [Selenium IDE framework](https://www.selenium.dev/selenium-ide/).

## Test Commands/Instructions for Running

To run all unit tests, in `logic-terrors/Webapp` run:
`pipenv run python3 manage.py test` (use `py` instead of `python3` for Windows PS)

To run unit tests for a specific app:
`pipenv run python3 manage.py test <name_of_application>` (use `py` instead of `python3` for Windows PS)

To run behavior tests, make sure you have the latest Chrome Browser installed on your computer. Run all commands found in "Running" section. Open a new terminal and navigate to `logic-terrors/Webapp`. Then run
`npm install -g selenium-side-runner`
`npm install -g chromedriver`
`selenium-side-runner tests/CalendarBehaviorTests.side` (Ctrl-C at the end of tests)
`selenium-side-runner tests/DiscussionsBehaviorTests.side` (Ctrl-C at the end of tests)
`selenium-side-runner tests/SettingsBehaviorTests.side` (Ctrl-C at the end of tests)
`selenium-side-runner tests/TasksBehaviorTests.side` (Ctrl-C at the end of tests)

## Test Locations/Directories

Unit tests are currently located in `Webapp/accounts_app/tests.py`, `Webapp/tasks_app/tests.py`, `Webapp/calendar_app/tests.py` and `Webapp/discussions_app/tests.py`

Behavior tests are currently located in `Webapp/tests/CalendarBehaviorTests.side`, `Webapp/tests/DiscussionsBehaviorTests.side`, `Webapp/tests/SettingsBehaviorTests.side`, and `Webapp/tests/TasksBehaviorTests.side`

# Authors

Rebecca Cunningham (RebeccaCun) rhc3@email.sc.edu  
Carson Murray (carsonmurr) cam50@email.sc.edu  
Hudson Hok (hudsonhok) hhok@email.sc.edu  
Devon Goshorn (DevGosho160) goshorna@email.sc.edu
