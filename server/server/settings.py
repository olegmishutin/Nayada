import configparser
from pathlib import Path

# Папки сервера и папка всего проекта
SERVER_DIR = Path(__file__).resolve().parent.parent
BASE_DIR = SERVER_DIR.parent

SECRET_KEY = 'django-insecure-n5bvjs3(m760@tss6+)wrnjl034mx6kq%52uz04j%q!z!*^ny!'
DEBUG = True

ALLOWED_HOSTS = []
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8000',
    'http://localhost:5173'
]
CORS_ORIGIN_ALLOW_ALL = True
AUTH_USER_MODEL = 'user.User'

# Приложения, которые связывеются с главным (главное - server)
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'user',
    'product',
    'order'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'server.urls'

# Настройки для HTML шаблонов
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'server.wsgi.application'

# Считиваем конфиг БД из файла db.ini
config = configparser.ConfigParser()
config.read(SERVER_DIR / 'db.ini')
dbConf = config['DB_CONF']

# Настройки для БД
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': dbConf['NAME'],
        'USER': dbConf['USER'],
        'PASSWORD': dbConf['PASSWORD'],
        'HOST': dbConf['HOST'],
        'PORT': dbConf['PORT'],
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'Ru-ru'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'  # url до статических файлов (js, css, картинки, видео и тд)

MEDIA_URL = 'media/'  # url до файлов медиа (которые может добавлять, удалять пользователь)
MEDIA_ROOT = SERVER_DIR / 'media/'  # Путь до папки медиа

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
