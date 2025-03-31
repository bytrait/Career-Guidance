from flask import request, jsonify, Blueprint
import json
from dotenv import load_dotenv
import os
import asyncio

from careers import career, career_mistral

career_api = Blueprint('career_api', __name__)


@career_api.route('/find_careers', methods=["POST"])
def find_careers():
    try:
        projectFolder = os.path.expanduser('../..')
        load_dotenv(os.path.join(projectFolder, '.env'))
        aiService = os.getenv('AI_SERVICE')

        request_data = json.loads(request.data)
        if aiService == 'mistral':
            response_data = asyncio.run(career_mistral.find_career(request_data))
        else:
            response_data = career.find_career(request_data)

        if response_data['status_code'] == 200:
            return jsonify(statusCode=response_data['status_code'], response=response_data['message']), response_data[
                'status_code']
        else:
            return jsonify(statusCode=response_data['status_code'], response=response_data['message']), response_data[
                'status_code']
    except Exception as e:
        return jsonify(isError=True, message='Failure', statusCode=500, data='error'), 500


@career_api.route('/find_career_steps', methods=["POST"])
def find_career_steps():
    try:
        projectFolder = os.path.expanduser('../..')
        load_dotenv(os.path.join(projectFolder, '.env'))
        aiService = os.getenv('AI_SERVICE')

        request_data = json.loads(request.data)

        if aiService == 'mistral':
            response_data = asyncio.run(career_mistral.find_career_steps(request_data))
        else:
            response_data = career.find_career_steps(request_data)

        if response_data['status_code'] == 200:
            return jsonify(statusCode=response_data['status_code'], response=response_data['message']), response_data[
                'status_code']
        else:
            return jsonify(statusCode=response_data['status_code'], response=response_data['message']), response_data[
                'status_code']
    except Exception as e:
        return jsonify(isError=True, message='Failure', statusCode=500, data='error'), 500


@career_api.route('/chat_answer', methods=["POST"])
def chat_answer():
    try:
        projectFolder = os.path.expanduser('../..')
        load_dotenv(os.path.join(projectFolder, '.env'))
        aiService = os.getenv('AI_SERVICE')

        request_data = json.loads(request.data)

        if aiService == 'mistral':
            response_data = asyncio.run(career_mistral.chat_answer(request_data))
        else:
            response_data = career.chat_answer(request_data)

        if response_data['status_code'] == 200:
            return jsonify(statusCode=response_data['status_code'], response=response_data['answer']), response_data[
                'status_code']
        else:
            return jsonify(statusCode=response_data['status_code'], response=response_data['answer']), response_data[
                'status_code']
    except Exception as e:
        return jsonify(isError=True, message='Failure', statusCode=500, data='error'), 500
