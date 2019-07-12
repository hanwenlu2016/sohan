import os
import sys
import time
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print(BASE_DIR )
sys.path.insert(0, os.path.join(BASE_DIR, 'extra_apps'))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '&+ddig^ovfh6%g@+^jj$n7ds%#hw1cbpmpw1jt^dwu)wgu@mgr'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']
AUTH_USER_MODEL = "sohan.UserProfile"  # 继承User必须写
# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'sohan.apps.SohanConfig',
    'xadmin',
    'crispy_forms',
    'reversion',

]

MIDDLEWARE = [
'django.middleware.security.SecurityMiddleware',
'django.contrib.sessions.middleware.SessionMiddleware',
'django.middleware.common.CommonMiddleware',
'django.middleware.csrf.CsrfViewMiddleware',
'django.contrib.auth.middleware.AuthenticationMiddleware',
'django.contrib.messages.middleware.MessageMiddleware',
'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'sohan_comps.urls'

TEMPLATES = [
{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [os.path.join(BASE_DIR, 'templates')]
    ,
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

WSGI_APPLICATION = 'sohan_comps.wsgi.application'

# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'sohan',
        'HOST': '192.168.6.106',
        'PORT': 3306,
        'USER': 'han',
        'PASSWORD': 'SY666.com',
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

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


# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = 'zh-Hans'

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]


# 邮件配置

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.163.com'  # SMTP地址 例如: smtp.163.com
EMAIL_PORT = 25  # SMTP端口 例如: 25
EMAIL_HOST_USER = 'xxx163.com'  # qq的邮箱 例如: xxxxxx@163.com
EMAIL_HOST_PASSWORD = 'xxx163.com'  # 我的邮箱密码 例如  xxxxxxxxx
EMAIL_USE_TLS = True  # 与SMTP服务器通信时，是否启动TLS链接(安全链接)。默认是false
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

#日志配置
# logging配置
log_file=r'D:\lings'
#log_file = '/py_sohan/sohan_comps/logs/'
log_file_path = os.path.join(log_file, 'django.log')
if not os.path.exists(log_file):
    os.mkdir(log_file)
    os.mknod(log_file_path)  # 创建空文件
 
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        # 日志格式
        'standard': {
            'format': '%(asctime)s [%(threadName)s:%(thread)d] [%(name)s:%(lineno)d] '
                      '[%(module)s:%(funcName)s] [%(levelname)s]- %(message)s'
        }
    },
    'filter': {
 
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': True,
        },
        'default': {
                    'level': 'DEBUG',
                    'class': 'logging.handlers.RotatingFileHandler',
                    'filename': log_file_path,         # 日志输出文件
                    'maxBytes': 1024*1024*5,                  # 文件大小
                    'backupCount': 5,                         # 备份份数
                    'formatter': 'standard',                  #使用哪种formatters日志格式
        },
        'error': {
                    'level': 'ERROR',
                    'class': 'logging.handlers.RotatingFileHandler',
                    'filename': log_file_path,
                    'maxBytes': 1024*1024*5,
                    'backupCount': 5,
                    'formatter': 'standard',
                },
        'console': {
                    'level': 'DEBUG',
                    'class': 'logging.StreamHandler',
                    'formatter': 'standard'
                },
        'request_handler': {
                    'level': 'DEBUG',
                    'class': 'logging.handlers.RotatingFileHandler',
                    'filename': log_file_path,
                    'maxBytes': 1024*1024*5,
                    'backupCount': 5,
                    'formatter': 'standard',
                },
        'scprits_handler': {
                    'level': 'DEBUG',
                    'class': 'logging.handlers.RotatingFileHandler',
                    'filename': log_file_path,
                    'maxBytes': 1024*1024*5,
                    'backupCount': 5,
                    'formatter': 'standard',
                }
    },
    'loggers': {
        'django': {
                    'handlers': ['default', 'console'],  # 来自上面定义的handlers内容
                        'level': 'INFO',
                    'propagate': False  # 是否继承父类的log信息
        },
        'scripts': {
            'handlers': ['scprits_handler'],
            'level': 'INFO',
            'propagate': False
        },
        # sourceDns.webdns.views 应用的py文件
        'sourceDns.webdns.views': {
                    'handlers': ['default', 'error'],
                    'level': 'INFO',
                    'propagate': True
        },
        'sourceDns.webdns.util': {
                    'handlers': ['error'],
                    'level': 'ERROR',
                    'propagate': True
        },
        # 'django.request': {
        #             'handlers': ['mail_admins'],
        #             'level': 'ERROR',
        #             'propagate': False,
        #         },
    }
}
