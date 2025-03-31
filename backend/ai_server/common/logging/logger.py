from dotenv import load_dotenv
import logging
import os

def get_logger_info():
    project_folder = os.path.expanduser('../..')
    load_dotenv(os.path.join(project_folder, '.env'))

    log_file_path = os.getenv('LOG_FILE_PATH')
    if log_file_path is None:
        log_file_path = './logs/career_gpt.log'
    logger_info = {
        'version': 1,
        'formatters': {
            'default': {'format': '%(asctime)s - %(levelname)s - %(message)s', 'datefmt': '%Y-%m-%d %H:%M:%S'}
        },
        'handlers': {
            'console': {
                'level': 'DEBUG',
                'class': 'logging.StreamHandler',
                'formatter': 'default',
                'stream': 'ext://sys.stdout'
            },
            'file': {
                'level': 'DEBUG',
                'class': 'logging.handlers.RotatingFileHandler',
                'formatter': 'default',
                'filename': log_file_path,
                'maxBytes': 5242880,
                'backupCount': 100
            }
        },
        'loggers': {
            'default': {
                'level': 'DEBUG',
                'handlers': ['console', 'file']
            }
        },
        'disable_existing_loggers': True
    }
    return logger_info


def get_gpt_logger():
    logger = logging.getLogger('default')
    return logger
