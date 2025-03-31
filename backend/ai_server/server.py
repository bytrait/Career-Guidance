from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from logging.config import dictConfig
import os

from common.logging.logger import get_logger_info
from api_routers.career_router import career_api


logger_info = get_logger_info()
dictConfig(logger_info)

app = Flask(__name__)
cors = CORS(app)

app.register_blueprint(career_api)


project_folder = os.path.expanduser('../..')
load_dotenv(os.path.join(project_folder, '.env'))
port = os.getenv('PORT') if os.getenv('PORT') is not None else 5004

if __name__ == '__main__':
    app.run(debug=True, port=port, host='0.0.0.0')
