from dotenv import load_dotenv
import openai
import os
import re
from common.logging.logger import get_gpt_logger
from common.db.db_helper import insert_career, insert_steps, update_step, add_careers, update_career_status


def find_career(data):
    careerData = {}
    try:
        userId = data['userId']
        careerData = data['careerData']
        log = get_gpt_logger()
        log.debug('Finding careers for user =%s, career_data=%s', userId, careerData)
        responseData = {}
        projectFolder = os.path.expanduser('../..')
        load_dotenv(os.path.join(projectFolder, '.env'))
        gptAPIKey = os.getenv('GPT_API_KEY')
        gptModel = os.getenv('GPT_MODEL')
        openai.api_key = gptAPIKey

        # Fetch career option for career 1
        messages = [{"role": "system", "content": "You are an intelligent assistant."}]
        careerStream1 = careerData['career1']  # "fashion design"
        careerStream2 = careerData['career2']  # "Engineering"
        allCareerStreams = careerStream1
        if careerStream2.strip():
            allCareerStreams = careerStream1 + ' AND ' + careerStream2
        personalityTrait1 = careerData['personalityTrait1']  # "Openness"
        personalityTrait2 = careerData['personalityTrait2']  # "Agreeableness"
        careerInterest1 = careerData['careerInterest1']  # "Social"
        careerInterest2 = careerData['careerInterest2']  # "Conventional"
        message = """        
        A 10th-grade student in India is interested in pursuing a career in the field of %s.

        Their Big 5 personality test shows the following traits -
            - %s
            - %s
       
            - Their RIASEC interest types indicate high career interests in
            - %s
            - %s
        Using this information provide 6 aspiring, fulfilling, and emerging career options that suit the best for this student.

        Out of these six options, the first two 2 options need to be from the first field, the second two options from the second field, and the last two options will be a combination of the first and the second field.

        Also, please provide the following details for each career option 
       - Explain the role,
       - Alignment of the career option with their personality and career interests,
       - Abilities required to perform,
       - Local and global job opportunities,
       - future trends, and
       - Aspiring career tagline.
            """ % (allCareerStreams, personalityTrait1, personalityTrait2, careerInterest1, careerInterest2)
        messages.append({"role": "user", "content": message}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        careerOptions = chat.choices[0].message.content
        log.debug('inserting career for user=%s', userId)

        allCareers = allCareerStreams + "====" + careerOptions
        # add career information in generated careers
        add_careers(allCareerStreams, personalityTrait1, personalityTrait2, careerInterest1, careerInterest2,
                    careerOptions)
        insert_career(userId, allCareers)

        responseData['message'] = "Career searched"
        responseData['status_code'] = 200
        return responseData
    except Exception as error:
        log.error('Error in search career for =%s', careerData, exc_info=True)
        raise error


def find_career_steps(data):
    try:
        userId = data['userId']
        careerTitle = data['careerTitle']
        log = get_gpt_logger()
        log.debug('Finding career steps for user =%s, career_title=%s', userId, careerTitle)
        responseData = {}

        project_folder = os.path.expanduser('../..')
        load_dotenv(os.path.join(project_folder, '.env'))
        gptAPIKey = os.getenv('GPT_API_KEY')
        gptModel = os.getenv('GPT_MODEL')
        openai.api_key = gptAPIKey
        careerTitle = careerTitle.strip()

        step1question = """
        A 10th-grade student would like to pursue a career as a %s. Provide guidance for the Exploration Phase (10th Grade - 12th Grade) using the following points:
        - Stream and Subject Selection: Suggest subjects aligned with the career option for the 11th and 12th grades.
        - List of top 10 institutes, schools or colleges in India with a link to their website that teach above subjects.
        - List of top 10 institutes, schools or colleges in Pune, India with a link to their website that teach above subjects
        - Extracurricular Activities: Suggest activities related to interests (clubs, internships, workshops).
        - Career Awareness and Research: Suggest what research should be done for the selected career option.
        """ % (careerTitle)
        messages = [{"role": "system", "content": "You are a intelligent assistant."}]
        messages.append({"role": "user", "content": step1question}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        careerSteps1 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 1 for {careerTitle}-: {careerSteps1}")
        update_step(careerTitle, 'step_1', careerSteps1)

        step2question = """
        A 10th-grade student would like to pursue a career as a %s. Provide Guidance on the Higher Education (Undergraduate Level) for this career in India and abroad using the following points.
        - Entrance Exams for higher education,
        - How to prepare for these entrance exams, and 
        - List top 10 reputable institutions, links to their website, indicative fee structure and yearly cost for bachelor's degree.
        - List top 10 reputable institutions in and around Pune, India, links to their website, indicative fee structure and yearly cost for bachelor's degree.
        """ % (careerTitle)
        messages = [{"role": "system", "content": "You are a intelligent assistant."}]
        messages.append({"role": "user", "content": step2question}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        careerSteps2 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 2 for {careerTitle}-: {careerSteps2}")
        update_step(careerTitle, 'step_2', careerSteps2)

        step3question = """
        A 10th-grade student would like to pursue a career as a %s. Provide Guidance on Skill Development and Networking during and after Higher Education for this career using the following points.
        - Internships: Practical experience through internships or summer programs.
        - Skill Enhancement: Additional skills related to the chosen field (courses, certifications, workshops).
        - Type of role as they enter into this field
        - Entry level salary in India
        - List of organisations or businesses that offer internship roles in this chosen field in India and abroad
        - Networking: Connecting with professionals, mentors, and alumni in the industry of interest.
         """ % (careerTitle)
        messages = [{"role": "system", "content": "You are a intelligent assistant."}]
        messages.append({"role": "user", "content": step3question}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        careerSteps3 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 3 for {careerTitle}-: {career_steps3}")
        update_step(careerTitle, 'step_3', careerSteps3)

        step4question = """
        A 10th-grade student would like to pursue a career as a %s. Provide Guidance on Postgraduate Studies (Optional) for this career using the following points
        - Higher Degrees: Options to pursue postgraduate studies like Master's or specialized courses for advanced knowledge.
        - Institutes: Top reputable institutions in India and Abroad, links to their website, indicative fee structure along with the total yearly cost of postgraduate studies.
        """ % (careerTitle)
        messages = [{"role": "system", "content": "You are a intelligent assistant."}]
        messages.append({"role": "user", "content": step4question}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        careerSteps4 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 4 for {careerTitle}-: {career_steps4}")
        update_step(careerTitle, 'step_4', careerSteps4)

        step5question = """
        A 10th-grade student would like to pursue a career as a %s. Provide Guidance on Entry into the Workforce after Higher Education or post-graduation for this career using the following points. :
        - Job Search: How to start applying for entry-level positions or graduate trainee programs.
        - Average starting salary in India
        - List of 10 companies in India and abroad that offer entry level positions 
        - Professional Growth: How to learn on the job, build expertise, and contribute to projects.
        """ % (careerTitle)
        messages = [{"role": "system", "content": "You are a intelligent assistant."}]
        messages.append({"role": "user", "content": step5question}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        careerSteps5 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 5 for {careerTitle}-: {career_steps5}")
        update_step(careerTitle, 'step_5', careerSteps5)

        step6question = """
        A 10th-grade student would like to pursue a career as a %s. Provide Guidance on Continuous Learning and Advancement as he or she enters into the workforce for this career using the following points. :
        - Skill Enhancement: How to continuously upgrade skills including soft skills to adapt to industry changes.
        - Career Advancement: How to aim for promotions, leadership roles, or specialization.
        """ % (careerTitle)
        messages = [{"role": "system", "content": "You are a intelligent assistant."}]
        messages.append({"role": "user", "content": step6question}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        careerSteps6 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 6 for {careerTitle}-: {career_steps6}")
        update_step(careerTitle, 'step_6', careerSteps6)

        step7question = """
        A 10th-grade student would like to pursue a career as a %s. Provide Guidance on Networking and Building a Reputation as he or she becomes a part of the workforce for this career using the following points
        - Professional Networking: How to cultivate relationships with peers and seniors in the industry.
        - Personal Branding: How to build a professional reputation through contributions, publications, or speaking engagements.
        """ % (careerTitle)
        messages = [{"role": "system", "content": "You are a intelligent assistant."}]
        messages.append({"role": "user", "content": step7question}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        careerSteps7 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 7 for {careerTitle}-: {career_steps7}")
        update_step(careerTitle, 'step_7', careerSteps7)

        step8question = """
        A 10th-grade student would like to pursue a career as a %s. Provide Guidance on Career Progression and Leadership as he or she builds a reputation in this career using the following points
        - Mentorship: How to seek mentorship and offer mentorship to younger professionals.
        - Leadership Roles: How to advance into managerial or leadership positions, contributing to the organization's growth.
        """ % (careerTitle)
        messages = [{"role": "system", "content": "You are a intelligent assistant."}]
        messages.append({"role": "user", "content": step8question}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        careerSteps8 = chat.choices[0].message.content
        # print(f"ChatGPT Reply for step 8 for {careerTitle}-: {career_steps8}")
        update_step(careerTitle, 'step_8', careerSteps8)
        update_career_status(careerTitle, 'Completed')
        log.debug('insert career steps for user=%s', userId)

        responseData['message'] = "Career searched"
        responseData['status_code'] = 200
        return responseData
    except Exception as error:
        log.error('Error in search career steps for user id=%s', userId, exc_info=True)
        update_career_status(careerTitle, 'Failed')
        raise error


def chat_answer(data):
    try:
        counsellorId = data['counsellorId']
        question = data['question']
        log = get_gpt_logger()
        log.debug('Getting answer for counsellorId =%s, question=%s', counsellorId, question)
        responseData = {}
        projectFolder = os.path.expanduser('../..')
        load_dotenv(os.path.join(projectFolder, '.env'))
        gptAPIKey = os.getenv('GPT_API_KEY')
        gptModel = os.getenv('GPT_MODEL')
        openai.api_key = gptAPIKey

        # Fetch career option for career 1
        messages = [{"role": "system", "content": "You are an intelligent assistant."}]
        message = question
        messages.append({"role": "user", "content": message}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        chatAnswer = chat.choices[0].message.content
        log.debug('Received chat answer for counsellor for counsellorId=%s, answer=%s', counsellorId, chatAnswer)

        responseData['answer'] = chatAnswer
        responseData['status_code'] = 200
        return responseData
    except Exception as error:
        log.debug('Error in getting answer for counsellorId =%s, question=%s', counsellorId, question, exc_info=True)
        raise error
