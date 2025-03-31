from dotenv import load_dotenv
from common.logging.logger import get_gpt_logger
from common.db.db_helper import insert_career, insert_steps, update_step, add_careers, update_career_status, \
    update_token_usage
import asyncio
import os

from mistralai.async_client import MistralAsyncClient
from mistralai.models.chat_completion import ChatMessage


async def find_career(data):
    careerData = {}
    try:
        userId = data['userId']
        careerData = data['careerData']
        log = get_gpt_logger()
        log.debug('Finding careers for user =%s, career_data=%s', userId, careerData)
        responseData = {}
        projectFolder = os.path.expanduser('../..')
        load_dotenv(os.path.join(projectFolder, '.env'))
        mistralAPIKey = os.getenv('MISTRAL_API_KEY')
        mistralModel = os.getenv('MISTRAL_AI_MODEL')
        client = MistralAsyncClient(api_key=mistralAPIKey)

        # Fetch career option for career 1
        qualification = careerData['qualification']  # "MBA or BE Electrical"
        allCareerStreams = qualification

        personalityTrait1 = careerData['personalityTrait1']  # "Openness"
        personalityTrait2 = careerData['personalityTrait2']  # "Agreeableness"
        careerInterest1 = careerData['careerInterest1']  # "Social"
        careerInterest2 = careerData['careerInterest2']  # "Conventional"
        message = """
A student pursuing his %s in India is looking for career options
Their Big 5 personality test shows the following traits -
            - %s
            - %s
       
Their RIASEC interest types indicate high career interests in the following types of work
            - %s
            - %s
Using this information please recommend 6 aspiring, fulfilling, and emerging career options including two entrepreneurial options that suit the best for this student based on their personality traits, RIASEC career interest types and their education background. Please explain each career option in one line. There must be only six lines in response. Don't send more than 6 lines. 
            """ % (allCareerStreams, personalityTrait1, personalityTrait2, careerInterest1, careerInterest2)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=message)],
                                 )
        careerOptions = chat.choices[0].message.content
        log.debug('inserting career for user=%s', userId)

        allCareers = allCareerStreams + "====" + careerOptions
        # add career information in generated careers
        add_careers(userId, allCareerStreams, personalityTrait1, personalityTrait2, careerInterest1, careerInterest2,
                    careerOptions)
        insert_career(userId, allCareers)

        responseData['message'] = "Career searched"
        responseData['status_code'] = 200
        return responseData
    except Exception as error:
        log.error('Error in search career for =%s', careerData, exc_info=True)
        raise error


async def find_career_steps(data):
    try:
        userId = data['userId']
        careerTitle = data['careerTitle']
        qualification = data['qualification']
        log = get_gpt_logger()
        log.debug('Finding career steps for user =%s, career_title=%s', userId, careerTitle)
        responseData = {}

        project_folder = os.path.expanduser('../..')
        load_dotenv(os.path.join(project_folder, '.env'))
        mistralAPIKey = os.getenv('MISTRAL_API_KEY')
        mistralModel = os.getenv('MISTRAL_AI_MODEL')
        careerTitle = careerTitle.strip()
        client = MistralAsyncClient(api_key=mistralAPIKey)

        step0question = """
        A student pursuing an %s in India would like to pursue a career as a %s. Please provide the following details in one line each for this career option 
       - Explain the role,
       - Alignment of the career option with their personality and career interests,
       - Local and global job opportunities,
       - future trends, and
       - Aspiring career tagline.
                """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step0question)], )
        careerSteps0 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 0 for {careerTitle}-: {careerSteps0}")
        update_step(careerTitle, qualification, 'step_0', careerSteps0)

        step1question = """
A student pursuing  %s in India would like to pursue a career as a %s. Provide guidance for the Exploration Phase using the following points:
- Extracurricular Activities: Suggest activities related to interests (clubs, workshops, social events).
- Career Research: Suggest what research should be done for the selected career option.
        """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step1question)], )
        careerSteps1 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 1 for {careerTitle}-: {careerSteps1}")
        update_step(careerTitle, qualification, 'step_1', careerSteps1)

        step2question = """
A student pursuing %s in India would like to pursue a career as a %s. Please provide the following details for this career option 
- General aptitude required to perform and how to work on them, 
- Abilities required to perform and how to achieve those 
- Additional certifications or qualifications required to perform in this role in India and abroad 
- Any technology-related skillsets or certifications required to perform in this role.

Please list courses to achieve the required aptitude and abilities and links to learn more about them. Also please create a plan per semester for 8 semesters to complete additional certifications, technology-related and other skilling courses or programmes that are outside of the curriculum. Please suggest 5 ideas for their Capstone project.
        """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step2question)], )
        careerSteps2 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 2 for {careerTitle}-: {careerSteps2}")
        update_step(careerTitle, qualification, 'step_2', careerSteps2)

        step3question = """
A student pursuing %s in India would like to pursue a career as a %s. Provide guidance for finding an internship:

- List of companies that offer internships
- How to approach these companies for internship
         """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step3question)], )
        careerSteps3 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 3 for {careerTitle}-: {career_steps3}")
        update_step(careerTitle, qualification, 'step_3', careerSteps3)

        step4question = """
A student pursuing %s in India would like to pursue a career as a %s. Provide guidance for getting the entry into the workforce using the following points:

- Entry-level job description in short and starting salary range
- Typical selection process for an entry-level job
- How to prepare for the selection process
- Guidance to create a LinkedIn profile and CV
        """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step4question)], )
        careerSteps4 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 4 for {careerTitle}-: {career_steps4}")
        update_step(careerTitle, qualification, 'step_4', careerSteps4)

        step5question = """
A student pursuing %s in India would like to pursue a career as a %s. Provide guidance for finding the entry-level opportunity using the following points:

- List of job portals and links to the open positions
- Companies offering entry-level positions in India and Abroad and links to their websites
        """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step5question)], )
        careerSteps5 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 5 for {careerTitle}-: {career_steps5}")
        update_step(careerTitle, qualification, 'step_5', careerSteps5)

        step6question = """
A student pursuing %s in India would like to pursue a career as a %s. Provide Guidance on Career Advancement once they enter into the workforce using the following points: 

- Aim for promotions, leadership roles, or specialization. 
- Cultivate relationships with peers and seniors in the industry. 
- Build a professional reputation through contributions, publications, or speaking engagements.
        """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step6question)], )
        careerSteps6 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 6 for {careerTitle}-: {career_steps6}")
        update_step(careerTitle, qualification, 'step_6', careerSteps6)

        step7question = """
A student pursuing %s in India would like to pursue a career as a  %s. Provide Guidance on Career Progression and Leadership using the following points when they are in the middle level of their career:

- Seek mentorship and offer mentorship to younger professionals.
- Advance into managerial or leadership positions, contributing to the organization's growth.
        """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step7question)], )
        careerSteps7 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 7 for {careerTitle}-: {career_steps7}")
        update_step(careerTitle, qualification, 'step_7', careerSteps7)

        step8question = """
Provide a summary of the Guidance to a student pursuing %s right from career exploration to becoming a successful professional with tips to stay motivated and enjoy this path and wish them good luck for their career journey as a %s.
        """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step8question)], )
        careerSteps8 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 8 for {careerTitle}-: {career_steps8}")
        update_step(careerTitle, qualification, 'step_8', careerSteps8)
        update_career_status(careerTitle, 'Completed')
        log.debug('insert career steps for user=%s', userId)

        responseData['message'] = "Career searched"
        responseData['status_code'] = 200
        return responseData
    except Exception as error:
        log.error('Error in search career steps for user id=%s', userId, exc_info=True)
        update_career_status(careerTitle, 'Failed')
        raise error


async def chat_answer(data):
    try:
        userId = data['userId']
        question = data['question']
        log = get_gpt_logger()
        log.debug('Getting answer for userId =%s, question=%s', userId, question)
        responseData = {}
        projectFolder = os.path.expanduser('../..')
        load_dotenv(os.path.join(projectFolder, '.env'))
        mistralAPIKey = os.getenv('MISTRAL_API_KEY')
        mistralModel = os.getenv('MISTRAL_AI_MODEL')
        client = MistralAsyncClient(api_key=mistralAPIKey)

        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=question)],
                                 )
        chatAnswer = chat.choices[0].message.content
        log.debug('Received chat answer for userId=%s, answer=%s', userId, chatAnswer)
        tokenUsed = chat.usage.total_tokens
        update_token_usage(userId, tokenUsed)

        responseData['answer'] = chatAnswer
        responseData['status_code'] = 200
        return responseData
    except Exception as error:
        log.debug('Error in getting answer for userId =%s, question=%s', userId, question, exc_info=True)
        raise error
