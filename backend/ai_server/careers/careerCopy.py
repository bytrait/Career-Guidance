from dotenv import load_dotenv
import openai
import os
from common.logging.logger import get_gpt_logger
from common.db.db_helper import insert_career, insert_steps


def find_career(data):
    try:
        user_id = data['userId']
        career_data = data['careerData']
        log = get_gpt_logger()
        log.debug('Finding careers for user =%s, career_data=%s', user_id, career_data)
        response_data = {}
        project_folder = os.path.expanduser('../..')
        load_dotenv(os.path.join(project_folder, '.env'))
        gptAPIKey = os.getenv('GPT_API_KEY')
        gptModel = os.getenv('GPT_MODEL')
        openai.api_key = gptAPIKey

        all_carrers = ''

        # Fetch career option for career 1
        messages = [{"role": "system", "content": "You are a intelligent assistant."}]
        question1 = """        
        Find 3 best-suited, aspiring, fulfilling, and emerging career paths in %s for a 10th-grade student in India using the following information.
        Explain the role and its alignment with their personality.
        Local and global job opportunities and future trends
        Also, please provide an aspiring career tagline for this career option.
        - Their Big 5 personality test shows the following traits -
        - Moderate neuroticism, Low extroversion, high openness to experience, high agreeableness and high conscientiousness,
        - Their RIASEC interest types indicate high career interest in social and conventional
        """ % (career_data['career1'])
        messages.append({"role": "user", "content": question1}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        career_options = chat.choices[0].message.content
        print(f"ChatGPT Reply career 1: {career_options}")
        all_carrers += career_data['career1'] + "====" + career_options + "----"

        # Fetch career option for career 2
        messages = [{"role": "system", "content": "You are a intelligent assistant."}]
        question1 = """        
        Find 3 best-suited, aspiring, fulfilling, and emerging career paths in %s for a 10th-grade student in India using the following information.
        Explain the role and its alignment with their personality.
        Local and global job opportunities and future trends
        Also, please provide an aspiring career tagline for this career option.
        - Their Big 5 personality test shows the following traits -
        - Moderate neuroticism, Low extroversion, high openness to experience, high agreeableness and high conscientiousness,
        - Their RIASEC interest types indicate high career interest in social and conventional
        """ % (career_data['career2'])
        messages.append({"role": "user", "content": question1}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        career_options = chat.choices[0].message.content
        print(f"ChatGPT Reply1 career 2: {career_options}")
        all_carrers += career_data['career2'] + "====" + career_options + "----"

        # Fetch career option for career 3
        messages = [{"role": "system", "content": "You are a intelligent assistant."}]
        question1 = """        
        Find 3 best-suited, aspiring, fulfilling, and emerging career paths in %s for a 10th-grade student in India using the following information.
        Explain the role and its alignment with their personality.
        Local and global job opportunities and future trends
        Also, please provide an aspiring career tagline for this career option.
        - Their Big 5 personality test shows the following traits -
        - Moderate neuroticism, Low extroversion, high openness to experience, high agreeableness and high conscientiousness,
        - Their RIASEC interest types indicate high career interest in social and conventional
        """ % (career_data['career3'])
        messages.append({"role": "user", "content": question1}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        career_options = chat.choices[0].message.content
        print(f"ChatGPT Reply1 career 3: {career_options}")
        all_carrers += career_data['career3'] + "====" + career_options

        log.debug('insert career for user=%s', user_id)

        insert_career(user_id, all_carrers)

        response_data['message'] = "Career searched"
        response_data['status_code'] = 200
        return response_data
    except Exception as error:
        log.error('Error in search career for =%s', career_data, exc_info=True)
        raise error


def find_career_steps(data):
    try:
        user_id = data['userId']
        career_title = data['careerTitle']
        log = get_gpt_logger()
        log.debug('Finding career steps for user =%s, cateer_title=%s', user_id, career_title)
        response_data = {}

        project_folder = os.path.expanduser('../..')
        load_dotenv(os.path.join(project_folder, '.env'))
        gptAPIKey = os.getenv('GPT_API_KEY')
        gptModel = os.getenv('GPT_MODEL')
        openai.api_key = gptAPIKey

        messages = [{"role": "system", "content": "You are a intelligent assistant."}]
        career_title = career_title.strip()
        step1question = """
        Provide guidance to a student as a first-person for the Exploration Phase (10th Grade - 12th Grade) to become a successful %s:
        - Subject Selection: Suggest subjects aligned with the career option in the 11th and 12th grades.
        - Extracurricular Activities: Suggest activities related to interests (clubs, internships, workshops).
        - Career Awareness and Research: Suggest what research should be done for the selected career option.
        """ % (career_title)
        messages.append({"role": "user", "content": step1question}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        career_steps1 = chat.choices[0].message.content
        print(f"ChatGPT Reply for step 1 for {career_title}-: {career_steps1}")

        step2question = """
        Provide Guidance on Higher Education (Undergraduate Level) for the above career option in India and abroad.
        - Entrance Exams for higher education and how to prepare for those:
        - Bachelor's Degree: List top reputable institutions, links to their website, indicative fee structure and yearly cost.
        """
        messages.append({"role": "user", "content": step2question}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        career_steps2 = chat.choices[0].message.content
        print(f"ChatGPT Reply for step 2 for {career_title}-: {career_steps2}")

        log.debug('insert career steps for user=%s', user_id)

        step3_8question = """
        Provide a career path further post the higher education for the above career option referring to the following six steps .
            1. Skill Development and Networking:
                - Internships: How to gain practical experience through internships or summer programs.
                - Skill Enhancement: How to learn additional skills related to the chosen field (courses, certifications, workshops).
                - Networking: How to connect with professionals, mentors, and alumni in the industry of interest.
            2. Postgraduate Studies (Optional):
                - Higher Degrees: Options to pursue postgraduate studies like Master's or specialized courses for advanced knowledge.
                - Institutes: Top 10 reputable institutions, links to their website, indicative fee structure along with total yearly cost of postgraduate studies.
                - Research Opportunities: Engage in research projects or programs if interested in academia.
            3. Entry into the Workforce:
                - Job Search: How to start applying for entry-level positions or graduate trainee programs.
                - Professional Growth: How to learn on the job, build expertise, and contribute to projects.
            4. Continuous Learning and Advancement:
                - Skill Enhancement: How to continuously upgrade skills to adapt to industry changes.
                - Career Advancement: How to aim for promotions, leadership roles, or specialization.
            5. Networking and Building a Reputation:
                - Professional Networking: How to cultivate relationships with peers and seniors in the industry.
                - Personal Branding: How to build a professional reputation through contributions, publications, or speaking engagements.
            6. Career Progression and Leadership:
                - Mentorship: How to seek mentorship and offer mentorship to younger professionals.
                - Leadership Roles: How to advance into managerial or leadership positions, contributing to the organization's growth.
        """
        messages.append({"role": "user", "content": step3_8question}, )
        chat = openai.ChatCompletion.create(model=gptModel, messages=messages, temperature=0, top_p=0)
        career_steps3_8 = chat.choices[0].message.content
        print(f"ChatGPT Reply for step 3-8 for {career_title}-: {career_steps3_8}")

        log.debug('insert career steps for user=%s', user_id)

        insert_steps(user_id, career_title, career_steps1 + "----" + career_steps2 + "----" + career_steps3_8)

        response_data['message'] = "Career searched"
        response_data['status_code'] = 200
        return response_data
    except Exception as error:
        log.error('Error in search career steps for user id=%s', user_id, exc_info=True)
        raise error
