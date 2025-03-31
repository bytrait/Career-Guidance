import psycopg2
from datetime import datetime

from common.db.db_connection import get_db_connection


def insert_career(user_id, career_options):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = 'delete from career_choices where user_id=%s'
        cursor.execute(query, (user_id,))

        query = 'insert into career_choices (user_id, careers) values (%s,%s)'
        cursor.execute(query, (user_id, career_options))
        connection.commit()

    except (Exception, psycopg2.Error) as error:
        print('Error in inserting careers for user id ', user_id, ' Error=', error)
        raise error

    finally:
        # closing database connection.
        if connection:
            cursor.close()
            connection.close()


def insert_steps(user_id, career_title, first_career_steps):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = 'delete from career_steps where career_title=%s'
        cursor.execute(query, (career_title,))

        query = 'insert into career_steps (career_title, first_career_steps) values (%s,%s)'
        cursor.execute(query, (career_title, first_career_steps))
        connection.commit()

    except (Exception, psycopg2.Error) as error:
        print('Error in inserting careers steps for user id =', user_id, 'career title =', career_title, ' Error=',
              error)
        raise error

    finally:
        # closing database connection.
        if connection:
            cursor.close()
            connection.close()


def add_careers(userId, qualification, personalityTrait1, personalityTrait2, careerInterest1, careerInterest2, careerOptions):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = 'delete from generated_careers where  user_id=%s'
        cursor.execute(query, (userId,))

        dateCreated = datetime.utcnow()
        query = 'insert into generated_careers (user_id,qualification,personality_trait1,personality_trait2,career_interest1,career_interest2,careers,creation_date) values (%s,%s,%s,%s,%s,%s,%s,%s)'
        cursor.execute(query, (
            userId, qualification, personalityTrait1, personalityTrait2, careerInterest1, careerInterest2, careerOptions,
            dateCreated))
        connection.commit()

    except (Exception, psycopg2.Error) as error:
        print('Error in adding 3 careers for qualification =', qualification, 'personalityTrait1 =', personalityTrait1,
              ' Error=',
              error)
        raise error

    finally:
        # closing database connection.
        if connection:
            cursor.close()
            connection.close()


def update_step(career_title, qualification, step_number, step_value):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = 'update all_career_steps set ' + step_number + '=%s where career_title=%s'
        cursor.execute(query, (step_value, career_title))
        connection.commit()

    except (Exception, psycopg2.Error) as error:
        print('Error in updating step for career_title =', career_title, ' step number =', step_number, ' Error=',
              error)
        raise error

    finally:
        # closing database connection.
        if connection:
            cursor.close()
            connection.close()


def update_career_status(career_title, status):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        end_time = datetime.utcnow()
        query = 'update all_career_steps set status=%s, end_time=%s where career_title=%s'
        cursor.execute(query, (status, end_time, career_title))
        connection.commit()

    except (Exception, psycopg2.Error) as error:
        print('Error in updating status for career_title =', career_title, ' status =', status, ' Error=',
              error)
        raise error

    finally:
        # closing database connection.
        if connection:
            cursor.close()
            connection.close()


def update_token_usage(user_id, token_used):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = 'update user_chats set total_token_used= (total_token_used + %s) where user_id=%s'
        cursor.execute(query, (token_used, user_id))
        connection.commit()

    except (Exception, psycopg2.Error) as error:
        print('Error in updating token for user_id =', user_id, ' token_used =', token_used, ' Error=',
              error)
        raise error

    finally:
        # closing database connection.
        if connection:
            cursor.close()
            connection.close()