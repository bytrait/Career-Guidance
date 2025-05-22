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
- Are highly aligned with my personality and career interests.
- Are relevant to the selected engineering discipline.
- Include a one-line inspiring description for each career option.
- Avoid overlapping roles and ensure diversity in the career paths.. 
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
        I am a first-semester engineering student pursuing %s and I have selected %s as my career goal. 
        - Can you explain what this career involves — its responsibilities, industries, required skills, and career progression? 
        - Also, recommend beginner-friendly resources (videos, articles, or communities) to explore this field. 
        - Suggest how I can get involved in relevant student clubs or competitions. 
                """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step0question)], )
        careerSteps0 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 0 for {careerTitle}-: {careerSteps0}")
        update_step(careerTitle, qualification, 'step_0', careerSteps0)

        step1question = """
        I am in my second semester student of %s and pursuing a career as a %s. Please suggest 
        - beginner tools, software, or languages I should start learning. 
        - Recommend small hands-on tasks or exercises, and online courses or certifications I can take to strengthen my fundamentals. 
        - Also, guide me on building my learning portfolio
        """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step1question)], )
        careerSteps1 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 1 for {careerTitle}-: {careerSteps1}")
        update_step(careerTitle, qualification, 'step_1', careerSteps1)

        step2question = """
        I am in my third semester student of %s and pursuing a career as a %s. Please suggest 
        - How to build intermediate-level skills. 
        - What tools, platforms, or software I should learn now
        - Suggest 2–3 small to mid-level project ideas relevant to this field. Provide step-by-step instructions to get started with each. 
        - Mention certifications I can pursue at this stage
        """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step2question)], )
        careerSteps2 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 2 for {careerTitle}-: {careerSteps2}")
        update_step(careerTitle, qualification, 'step_2', careerSteps2)

        step3question = """
        I am in my fourth semester student of %s and pursuing a career as a %s. 
        - Recommend hands-on experiences such as simulations, competitions, or reverse engineering projects that help apply my skills. 
        - Also, guide me on documenting projects professionally on platforms like GitHub, Behance, or others. 
         """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step3question)], )
        careerSteps3 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 3 for {careerTitle}-: {career_steps3}")
        update_step(careerTitle, qualification, 'step_3', careerSteps3)

        step4question = """
        I am in my fifth semester student of %s and pursuing a career as a %s. 

        - Recommend advanced tools, concepts, or techniques I should learn. 
        - Also, suggest 2–3 capstone project ideas that are aligned with this role. 
        - Provide steps or components to build those projects. 
        - Recommend certifications and real-world case studies to learn from.
        """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step4question)], )
        careerSteps4 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 4 for {careerTitle}-: {career_steps4}")
        update_step(careerTitle, qualification, 'step_4', careerSteps4)

        step5question = """
        I am in my sixth semester student of %s and pursuing a career as a %s. 

        - What types of companies and job roles should I look for? 
        - How should I present my skills and portfolio? 
        - Suggest tips for resume creation and interview preparation. 
        """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step5question)], )
        careerSteps5 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 5 for {careerTitle}-: {career_steps5}")
        update_step(careerTitle, qualification, 'step_5', careerSteps5)

        step6question = """
        I am in my seventh semester student of %s and pursuing a career as a %s. 

        - Please suggest industries, company names, and roles I should target. 
        - Recommend 2–3 final-year project ideas that are high impact and aligned with this career. 
        - Provide step-by-step breakdowns for each project. 
        """ % (qualification, careerTitle)
        chat = await client.chat(model=mistralModel, messages=[ChatMessage(role="user", content=step6question)], )
        careerSteps6 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 6 for {careerTitle}-: {career_steps6}")
        update_step(careerTitle, qualification, 'step_6', careerSteps6)

        step7question = """
        I am in my eighth semester student of %s and pursuing a career as a %s. 

        - Please guide me through the job search process. 
        - Recommend tips for networking, cold emailing, and interview rounds. 
        - Suggest a checklist to finalize my profile. 
        - Recommend a final test or skill assessment to make sure I’m industry ready before graduation.
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
