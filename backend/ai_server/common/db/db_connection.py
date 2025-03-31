from dotenv import load_dotenv
import psycopg2
import os


def get_db_connection():
    try:
        # Load database information
        project_folder = os.path.expanduser('../..')
        load_dotenv(os.path.join(project_folder, '.env'))

        user = os.getenv('DB_USER')
        password = os.getenv('DB_PASSWORD')
        host = os.getenv('DB_HOST')
        port = os.getenv('DB_PORT')
        database = os.getenv('DB_NAME')
        connection = psycopg2.connect(user=user, password=password, host=host, port=port, database=database)

        return connection

    except (Exception, psycopg2.Error) as error:
        print('Error in getting db connection. Error=', error)
        raise error
