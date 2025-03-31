const bcrypt = require('bcryptjs')
const lc = require('lower-case')
const cryptoRandomString = require('crypto-random-string')
const httpStatus = require('http-status-codes')
const jwt = require('jsonwebtoken')
const logger = require('../logger/logger')
require('dotenv').config()
const axios = require('axios')
const https = require('https');
const fs = require('fs');

const { INTERNAL_SERVER_ERROR } = require('../../common/common-constants')
const { getCareerChoices, getAllCareerSteps, getCareerQuestions, insertCareerTestResults,
    readCareerTestResults, readPersonalityTestResults, getGeneratedCareers, insertCareer, insertAllSteps,
    saveAllCareerAnswers, updateCareerAnswers, getStudentData, getQualification, saveCareer,
    getPreferredCareer, getCareerPreferences, fetchCourses, fetchReportCourses } = require('../career/career-db-helper')
const { CAREER_SUCCESS_MSGS } = require('./career-constants')


async function getQuestions(input) {
    try {
        logger.debug.debug('in career-helper getQuestions')
        const results = await getCareerQuestions();
        let questionData = [];
        results.rows.forEach((element, index) => {
            if ((process.env.DEMO == 'true' || input.isDemoUser == '1') && index > 4) {
                return
            }
            questionData.push({
                qId: element.q_id,
                question: element.question,
                riasecType: element.riasec_type,
            });
        });

        const result = {
            statusCode: httpStatus.OK,
            data: { success: true, message: 'Question retrieved', questionData: questionData }
        }
        return result

    } catch (error) {
        logger.debug.debug('in career-helper getQuestions server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function getMobileQuestions(input) {
    try {
        logger.debug.debug('in career-helper getMobileQuestions')
        const token = 'Y2FyZWVybG9neTo5NTYyYW16'
        const questionURL = `${process.env.INTEREST_API_URL}/questions_30?start=1&end=30`;
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false
        });

        const options = {
            headers: {
                Authorization: `Basic ${token}`
            },
            httpsAgent: httpsAgent
        }

        const questionResponse = await axios.get(questionURL, options);

        let questionData = questionResponse.data
        if (process.env.DEMO == 'true' || input.isDemoUser == '1') {
            questionData.question = questionData.question.slice(0, 5)
        }

        const result = {
            statusCode: httpStatus.OK,
            data: {
                success: true, message: "Question retrieved", questionData: questionData,
            }
        }
        return result

    } catch (error) {
        logger.debug.debug('in career-helper getMobileQuestions server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function getCareers(input) {
    try {
        logger.debug.debug('in career-helper getCareers')
        let answers = input.answers; // Example {'qId1': 'answer1','qId2': 'answer2','qId3': 'answer3',}
        if (process.env.DEMO == 'true' || input.isDemoUser == '1') {
            answers = {
                "1": 5, "2": 5, "3": 5, "4": 5, "5": 5, "6": 5, "7": 5, "8": 5, "9": 5, "10": 5,
                "11": 5, "12": 4, "13": 2, "14": 2, "15": 2, "16": 2, "17": 2, "18": 4, "19": 2, "20": 2,
                "21": 4, "22": 2, "23": 4, "24": 4, "25": 2, "26": 2, "27": 4, "28": 2, "29": 2, "30": 2,
                "31": 4, "32": 2, "33": 2, "34": 4, "35": 4, "36": 2, "37": 4, "38": 2, "39": 2, "40": 2,
                "41": 4, "42": 2, "43": 4, "44": 2, "45": 2, "46": 2, "47": 4, "48": 2, "49": 4, "50": 2
            }
        }
        const scoreR = parseInt(answers[1]) + parseInt(answers[2]) + parseInt(answers[13]) + parseInt(answers[14]) + parseInt(answers[25]) + parseInt(answers[26])
        const scoreI = parseInt(answers[3]) + parseInt(answers[4]) + parseInt(answers[15]) + parseInt(answers[16]) + parseInt(answers[27]) + parseInt(answers[28])
        const scoreA = parseInt(answers[5]) + parseInt(answers[6]) + parseInt(answers[17]) + parseInt(answers[18]) + parseInt(answers[29]) + parseInt(answers[30])
        const scoreS = parseInt(answers[7]) + parseInt(answers[8]) + parseInt(answers[19]) + parseInt(answers[20])
        const scoreE = parseInt(answers[9]) + parseInt(answers[10]) + parseInt(answers[21]) + parseInt(answers[22])
        const scoreC = parseInt(answers[11]) + parseInt(answers[12]) + parseInt(answers[23]) + parseInt(answers[24])


        let careerInterestData = [
            {
                'riasecType': 'Realistic', 'score': scoreR, 'description': [
                    'Hands-On Approach: Realistic individuals prefer practical, hands-on tasks that involve physical activity.',
                    'Technical Skills: They excel in roles that involve mechanical, technical, or physical skills.',
                    'Problem-Solving Abilities: They are generally proficient in troubleshooting and finding practical solutions to tangible problems.',
                    'Prefer Tangible Results: They enjoy seeing concrete, visible results of their work, such as building or fixing things.',
                    'Interest in Trades: They are inclined towards careers in trades, engineering, construction, or fields that involve working with tools and machinery.'
                ]
            },
            {
                'riasecType': 'Investigative', 'score': scoreI, 'description': [
                    'Analytical Thinking: Investigative individuals possess strong analytical and problem-solving skills.',
                    'Curiosity and Inquiry: They are naturally curious, often questioning and exploring to understand complex concepts.',
                    'Intellectual Pursuits: They enjoy academic pursuits, research, and roles that involve exploration and investigation.',
                    'Detail-Oriented: They pay attention to details, seeking precision and accuracy in their work.',
                    'Scientific Interest: They are inclined towards careers in science, technology, research, or any field that involves experimentation and discovery.',

                ]
            },
            {
                'riasecType': 'Artistic', 'score': scoreA, 'description': [
                    'Creativity: Artistic individuals are highly creative and imaginative, often thinking outside the box.',
                    'Expressive Communication: They express themselves through various mediums, such as art, writing, music, or performance.',
                    'Visual Acuity: They possess a keen eye for aesthetics and often appreciate and create visually appealing works.',
                    'Originality: They enjoy originality and innovation, bringing fresh perspectives to their work.',
                    'Passion for the Arts: They are inclined towards careers in the arts, design, music, literature, or any field that allows for creative expression.',
                ]
            },
            {
                'riasecType': 'Social', 'score': scoreS, 'description': [
                    'Interpersonal Skills: Social individuals excel in connecting and interacting with others, demonstrating strong social skills.',
                    'Empathy: They have a natural ability to understand and resonate with others\' emotions and experiences.',
                    'Collaboration: They thrive in group settings and work effectively as part of a team, fostering cooperation and harmony.',
                    'Helping Nature: They are often inclined towards professions that involve helping, such as counseling, teaching, healthcare, or social work.',
                    'Community Engagement: They enjoy contributing to the community and feel fulfilled by making a positive impact on others\' lives.',

                ]
            },
            {
                'riasecType': 'Enterprising', 'score': scoreE, 'description': [
                    'Leadership: Enterprising individuals exhibit leadership qualities, often taking charge and guiding others toward common goals.',
                    'Risk-Taking: They are comfortable with taking calculated risks, seeking opportunities in challenging situations.',
                    'Persuasion Skills: They excel in influencing and persuading others, often engaging in negotiations or sales roles.',
                    'Goal-Oriented: Enterprising people are driven by goals, ambitions, and the pursuit of success in their endeavors.',
                    'Initiative: They are proactive and self-motivated, often initiating new projects or ventures to achieve their aspirations.',
                ]
            },
            {
                'riasecType': 'Conventional', 'score': scoreC, 'description': [
                    'Structured Approach: Conventional individuals prefer a structured and systematic approach to their work and tasks.',
                    'Detail-Oriented: They excel in tasks that require attention to detail, accuracy, and precision.',
                    'Organizational Skills: They are highly organized and prefer roles that involve maintaining order and systems.',
                    'Preference for Rules: They thrive in environments where there are clear rules, procedures, and established norms.',
                    'Administrative Proficiency: They are inclined towards careers in administration, accounting, data analysis, or roles that involve handling details and organizing information.',
                ]
            }
        ]

        careerInterestData = careerInterestData.sort((a, b) => a.score > b.score ? -1 : 1);
        logger.debug.debug('in career-helper getCareers saving  career test results for user Id' + input.userId)
        const dateCreated = new Date(Date.now()).toISOString()

        await insertCareerTestResults({ userId: input.userId, careerInterestData: JSON.stringify(careerInterestData), dateCreated: dateCreated })

        const result = {
            statusCode: httpStatus.OK,
            data: {
                success: true, message: 'career interest score generated', careerInterestData: careerInterestData
            }
        }
        return result
    } catch (error) {
        logger.debug.debug('in career-helper getCareers server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function getCareerOptions(userId) {
    try {
        logger.debug.debug('in career-helper getCareerOptions')
        const results = await getCareerChoices(userId);
        const careerOptions = formatCareerOptions(results)

        const result = {
            statusCode: httpStatus.OK,
            data: { success: true, message: CAREER_SUCCESS_MSGS.CAREER_CHOICES_SUCCESS, careerOptions: careerOptions }
        }
        return result

    } catch (error) {
        logger.debug.debug('in career-helper getCareerOptions server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function generateCareerOptions(input) {
    try {
        logger.debug.debug('in career-helper generateCareerOptions by user ' + input.userId)
        let careerData = input.careerData
        // read personality test results from DB
        const personallityResults = await readPersonalityTestResults(input.userId)
        const personalityResultData = JSON.parse(personallityResults.rows[0].personality_test_results)
        let personalityScores = [
            { 'type': 'Openness', 'score': personalityResultData.oPersonality.score },
            { 'type': 'Conscientiousness', 'score': personalityResultData.cPersonality.score },
            { 'type': 'Extroversion', 'score': personalityResultData.ePersonality.score },
            { 'type': 'Agreeableness', 'score': personalityResultData.aPersonality.score },
            { 'type': 'Neuroticism', 'score': personalityResultData.nPersonality.score }
        ]

        personalityScores = personalityScores.sort((a, b) => a.score > b.score ? -1 : 1);
        careerData['personalityTrait1'] = personalityScores[0].type
        careerData['personalityTrait2'] = personalityScores[1].type

        // read career Interest results from DB
        const careerResults = await readCareerTestResults(input.userId)
        const careerResultData = JSON.parse(careerResults.rows[0].career_test_results)
        careerData['careerInterest1'] = careerResultData[0].riasecType
        careerData['careerInterest2'] = careerResultData[1].riasecType

        // check if careers for this request already exists
        const careerResult = await getGeneratedCareers(input.careerData)
        if (careerResult.rowCount == 1) {
            const careers = careerResult.rows[0].careers
            // if careers are already generated, insert record for user
            const cStream = careerData.qualification
            const allCareers = cStream + "====" + careers
            await insertCareer({ userId: input.userId, careers: allCareers })

        }
        else {
            const postData = { userId: input.userId, careerData: input.careerData }
            await axios.post(`${process.env.ML_API_URL}` + "/find_careers", postData)
        }

        const result = { statusCode: httpStatus.OK, data: { success: true, message: CAREER_SUCCESS_MSGS.CARRER_CHOICES_GENERATED } }
        return result

    } catch (error) {
        logger.debug.debug('in career-helper trainModel server error by userId=' + input.userId + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }
}


async function getCareerSteps(input) {
    try {
        logger.debug.debug('in career-helper getCareerSteps for input.careerTitle' + input.careerTitle + ' by user Id=' + input.userId)
        const res = await getQualification(input);
        if (res.rowCount !== 1) {
            logger.debug.debug('in career-helper getCareerOptions server invalid user=' + input.userId)
            const result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: 'Invalid User' } }
            return result
        }
        input.qualification = res.rows[0].qualification
        const results = await getAllCareerSteps(input);

        let firstCareerSteps
        if (results.rowCount == 1 && results.rows[0].status != 'Failed') {
            firstCareerSteps = results.rows[0]
        } else {
            // insert row for career steps:
            logger.debug.debug('in career-helper before calling GPT API for input.careerTitle=' + input.careerTitle)
            const generatingText = 'Generating...'
            const status = 'In-progress'
            const startTime = new Date(Date.now()).toISOString()
            await insertAllSteps({ careerTitle: input.careerTitle, qualification: input.qualification, generatingText, status, startTime })

            // call chat GPT API to generate career steps
            const postData = { userId: input.userId, careerTitle: input.careerTitle, qualification: input.qualification }
            //axios.post(`${process.env.ML_API_URL}` + "/find_career_steps", postData)

            axios
                .post(`${process.env.ML_API_URL}` + "/find_career_steps", postData)
                .then((response) => { console.log(response) })
                .catch((err) => console.log(err));

            const result2 = await getAllCareerSteps(input);
            firstCareerSteps = result2.rows[0]
        }
        let steps = {}, careerSteps = {}
        steps['Step 0'] = convertUrlsToLinks(firstCareerSteps.step_0.replace(/\*\*/g, ""));
        steps['Step 1'] = convertUrlsToLinks(firstCareerSteps.step_1.replace(/\*\*/g, ""));
        steps['Step 2'] = convertUrlsToLinks(firstCareerSteps.step_2.replace(/\*\*/g, ""));
        steps['Step 3'] = convertUrlsToLinks(firstCareerSteps.step_3.replace(/\*\*/g, ""));
        steps['Step 4'] = convertUrlsToLinks(firstCareerSteps.step_4.replace(/\*\*/g, ""));
        steps['Step 5'] = convertUrlsToLinks(firstCareerSteps.step_5.replace(/\*\*/g, ""));
        steps['Step 6'] = convertUrlsToLinks(firstCareerSteps.step_6.replace(/\*\*/g, ""));
        steps['Step 7'] = convertUrlsToLinks(firstCareerSteps.step_7.replace(/\*\*/g, ""));
        steps['Step 8'] = convertUrlsToLinks(firstCareerSteps.step_8.replace(/\*\*/g, ""));
        careerSteps['firstCareerSteps'] = steps
        careerSteps['status'] = firstCareerSteps.status

        const result = {
            statusCode: httpStatus.OK,
            data: { success: true, message: CAREER_SUCCESS_MSGS.CAREER_STEPS_SUCCESS, careerSteps: careerSteps }
        }
        return result

    } catch (error) {
        logger.debug.debug('in career-helper getCareerOptions server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function getCareerReport(userId) {
    try {
        logger.debug.debug('in career-helper getCareerReport')

        const careerResults = await readCareerTestResults(userId)
        const careerInterestData = JSON.parse(careerResults.rows[0].career_test_results)

        const personallityResults = await readPersonalityTestResults(userId)
        const personalityData = JSON.parse(personallityResults.rows[0].personality_test_results)

        const results = await getCareerChoices(userId);
        const careerOptions = formatCareerOptions(results)

        const preferredCareerRes = await getPreferredCareer(userId);
        let preferredCareer = ''
        if (preferredCareerRes.rows.length == 1) {
            preferredCareer = preferredCareerRes.rows[0].preferred_career;
        }

        const result = {
            statusCode: httpStatus.OK,
            data: {
                success: true, message: 'User Report fetched', reportData: {
                    careerInterestData, personalityData, careerOptions, preferredCareer
                }
            }
        }
        return result
    } catch (error) {
        logger.debug.debug('in career-helper getCareers server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

function formatCareerOptionsOLD(results) {
    let careerOptions = {};
    const allCareers = results.rows[0].careers.split("----")
    let suggetion, suggestedCareers = [], careerId = 0, cData, careerStream
    for (let i = 0; i < 1; i++) { // No need of loop. allCareers will have only one element not 3
        cData = allCareers[i].split("====")[1].split("\n")
        careerStream = allCareers[i].split("====")[0]
        cData = cData.filter(item => item != '')
        ++careerId
        let careerTitle = cData[0].includes("Career Option") ? cData[0].split(":")[1].trim() : cData[0].split(".")[1].trim().replace(":", "")
        suggetion = {
            "careerId": careerId,
            "careerTitle": careerTitle,
            "careerDescription": cData[1] + "\n" + cData[2] + "\n" + cData[3] + "\n" + cData[4] + "\n" + cData[5] + "\n" + cData[6]
        }
        suggestedCareers.push(suggetion)

        ++careerId
        careerTitle = cData[7].includes("Career Option") ? cData[7].split(":")[1].trim() : cData[7].split(".")[1].trim().replace(":", "")
        suggetion = {
            "careerId": careerId,
            "careerTitle": careerTitle,
            "careerDescription": cData[8] + "\n" + cData[9] + "\n" + cData[10] + "\n" + cData[11] + "\n" + cData[12] + "\n" + cData[13]
        }
        suggestedCareers.push(suggetion)

        ++careerId
        careerTitle = cData[14].includes("Career Option") ? cData[14].split(":")[1].trim() : cData[14].split(".")[1].trim().replace(":", "")
        suggetion = {
            "careerId": careerId,
            "careerTitle": careerTitle,
            "careerDescription": cData[15] + "\n" + cData[16] + cData[17] + "\n" + cData[18] + "\n" + cData[19] + "\n" + cData[20]
        }
        suggestedCareers.push(suggetion)

    }
    careerOptions['suggestedCareers'] = suggestedCareers
    careerOptions['careerStream'] = careerStream

    return careerOptions
}

function formatCareerOptionsGPT4(results) {
    let careerOptions = {};
    const allCareers = results.rows[0].careers.split("----")
    let suggetion, suggestedCareers = [], careerId = 0, cData, careerStream
    for (let i = 0; i < 1; i++) { // No need of loop. allCareers will have only one element not 3
        cData = allCareers[i].split("====")[1].split("\n")
        careerStream = allCareers[i].split("====")[0]
        cData = cData.filter(item => item != '')
        ++careerId
        let careerTitle = cData[0].slice(3).replace('Career Option: ', '')
        suggetion = {
            "careerId": careerId,
            "careerTitle": careerTitle,
            "careerDescription": cData[1] + "\n" + cData[2] + "\n" + cData[3] + "\n" + cData[4] + "\n" + cData[5] + "\n" + cData[6]
        }
        suggestedCareers.push(suggetion)

        ++careerId
        careerTitle = cData[7].slice(3).replace('Career Option: ', '')
        suggetion = {
            "careerId": careerId,
            "careerTitle": careerTitle,
            "careerDescription": cData[8] + "\n" + cData[9] + "\n" + cData[10] + "\n" + cData[11] + "\n" + cData[12] + "\n" + cData[13]
        }
        suggestedCareers.push(suggetion)

        ++careerId
        careerTitle = cData[14].slice(3).replace('Career Option: ', '')
        suggetion = {
            "careerId": careerId,
            "careerTitle": careerTitle,
            "careerDescription": cData[15] + "\n" + cData[16] + cData[17] + "\n" + cData[18] + "\n" + cData[19] + "\n" + cData[20]
        }
        suggestedCareers.push(suggetion)

        ++careerId
        careerTitle = cData[21].slice(3).replace('Career Option: ', '')
        suggetion = {
            "careerId": careerId,
            "careerTitle": careerTitle,
            "careerDescription": cData[22] + "\n" + cData[23] + "\n" + cData[24] + "\n" + cData[25] + "\n" + cData[26] + "\n" + cData[27]
        }
        suggestedCareers.push(suggetion)

        ++careerId
        careerTitle = cData[28].slice(3).replace('Career Option: ', '')
        suggetion = {
            "careerId": careerId,
            "careerTitle": careerTitle,
            "careerDescription": cData[29] + "\n" + cData[30] + "\n" + cData[31] + "\n" + cData[32] + "\n" + cData[33] + "\n" + cData[34]
        }
        suggestedCareers.push(suggetion)

        ++careerId
        careerTitle = cData[35].slice(3).replace('Career Option: ', '')
        suggetion = {
            "careerId": careerId,
            "careerTitle": careerTitle,
            "careerDescription": cData[36] + "\n" + cData[37] + "\n" + cData[38] + "\n" + cData[39] + "\n" + cData[40] + "\n" + cData[41]
        }
        suggestedCareers.push(suggetion)

    }
    careerOptions['suggestedCareers'] = suggestedCareers
    careerOptions['careerStream'] = careerStream

    return careerOptions
}

function formatCareerOptions(results) {
    let careerOptions = {};
    const allCareers = results.rows[0].careers.split("----")
    let suggetion, suggestedCareers = [], cData, careerStream, careerTitle, careerData, description
    let regex1 = /[^:]*:(?=\s)/g;
    let regex2 = /^\d+\.\s*/gm; // replace 1. , 2. etc with empty
    let regex3 = /^[a-z]\)\s*/gim; // replace a) , b) etc with empty
    let regex4 = /\(.*?\)/g; // replace anything insided brackets with empty. E.g. Architectural Designer (Construction and Architecture)' with Architectural Designer

    for (let i = 0; i < 1; i++) { // No need of loop. allCareers will have only one element not 3
        cData = allCareers[i].split("====")[1]
        careerStream = allCareers[i].split("====")[0]
        const paragraphs = splitSections(cData)
        for (let c = 0; c < 6; c++) {
            /*careerData = paragraphs[c].split(":")
            if (careerData.length == 2) {
                careerTitle = careerData[0]
                description = careerData[1]
            } else if (careerData.length == 3) {
                careerTitle = careerData[1]
                description = careerData[2]
            }*/
            let careerData = paragraphs[c].split(/:(.+)/); // This regex captures everything after the first colon

            let careerTitle = careerData[0].trim(); // Get the first part and trim whitespace
            let description = careerData[1].trim()

            suggetion = {
                "careerId": c + 1,
                "careerTitle": careerTitle.replace(regex1, '').replace(regex2, '').replace(regex3, '').replace(regex4, '').replace(':', '').replace('**', '').trim(),
                "careerDescription": description
            }
            suggestedCareers.push(suggetion)
        }
    }
    careerOptions['suggestedCareers'] = suggestedCareers
    careerOptions['careerStream'] = careerStream

    return careerOptions
}

function formatCareerOptionsNEW(results) {
    let careerOptions = {};
    const allCareers = results.rows[0].careers.split("----")
    let suggetion, suggestedCareers = [], cData, careerStream
    for (let i = 0; i < 1; i++) { // No need of loop. allCareers will have only one element not 3
        cData = allCareers[i].split("====")[1].split("\n")
        careerStream = allCareers[i].split("====")[0]
        cData = cData.filter(item => item != '')
        suggetion = {
            "careerId": 1,
            "careerStream": cData[0],
            "careerTitle": cData[1].split(":")[0].slice(3),
            "careerDescription": cData[1].split(":")[1].trim()
        }
        suggestedCareers.push(suggetion)
        suggetion = {
            "careerId": 2,
            "careerStream": cData[0],
            "careerTitle": cData[2].split(":")[0].slice(3),
            "careerDescription": cData[2].split(":")[1].trim()
        }
        suggestedCareers.push(suggetion)

        suggetion = {
            "careerId": 3,
            "careerStream": cData[3],
            "careerTitle": cData[4].split(":")[0].slice(3),
            "careerDescription": cData[4].split(":")[1].trim()
        }
        suggestedCareers.push(suggetion)

        suggetion = {
            "careerId": 4,
            "careerStream": cData[3],
            "careerTitle": cData[5].split(":")[0].slice(3),
            "careerDescription": cData[5].split(":")[1].trim()
        }
        suggestedCareers.push(suggetion)

        suggetion = {
            "careerId": 5,
            "careerStream": cData[6],
            "careerTitle": cData[7].split(":")[0].slice(3),
            "careerDescription": cData[7].split(":")[1].trim()
        }
        suggestedCareers.push(suggetion)

        suggetion = {
            "careerId": 6,
            "careerStream": cData[6],
            "careerTitle": cData[8].split(":")[0].slice(3),
            "careerDescription": cData[8].split(":")[1].trim()
        }
        suggestedCareers.push(suggetion)

    }
    careerOptions['suggestedCareers'] = suggestedCareers
    careerOptions['careerStream'] = careerStream

    return careerOptions
}


async function saveCareerAnswers(input) {
    try {
        logger.debug.debug('in career-helper saveCareerAnswers for userid=' + input.userId)
        let answers = JSON.stringify(input.answers)
        const updatedDate = new Date(Date.now()).toISOString()
        const updateResult = await updateCareerAnswers({ answers: answers, userId: input.userId, updatedDate: updatedDate });

        if (updateResult.rowCount != 1) {
            const saveResult = await saveAllCareerAnswers({ answers: answers, userId: input.userId, updatedDate: updatedDate });
        }

        const result = {
            statusCode: httpStatus.OK,
            data: { success: true, message: CAREER_SUCCESS_MSGS.CAREER_ANSWERS_SAVED }
        }
        return result
    } catch (error) {
        logger.debug.debug('in career-helper getCareers server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function getStudentCareerReport(input) {
    try {
        logger.debug.debug('in career-helper getStudentCareerReport by counsellorId=' + input.counsellorId)
        if (input.counsellorId == input.studentId) {
            // student id and counsellor id cannot be same
            let result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: 'Invalid student Id' } }
            return result
        }
        // check studentId belongs to counsellor's school
        const res = await getStudentData(input)
        if (res.rows.length != 1) {
            let result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: 'Invalid student Id' } }
            return result
        }
        const careerResults = await readCareerTestResults(input.studentId)
        if (careerResults.rows.length != 1) {
            let result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: 'Invalid student Id' } }
            return result
        }
        const careerInterestData = JSON.parse(careerResults.rows[0].career_test_results)

        const personallityResults = await readPersonalityTestResults(input.studentId)
        const personalityData = JSON.parse(personallityResults.rows[0].personality_test_results)

        const results = await getCareerChoices(input.studentId);
        const careerOptions = formatCareerOptions(results)

        const preferredCareerRes = await getPreferredCareer(input.studentId);
        let preferredCareer = ''
        if (preferredCareerRes.rows.length == 1) {
            preferredCareer = preferredCareerRes.rows[0].preferred_career;
        }


        const result = {
            statusCode: httpStatus.OK,
            data: {
                success: true, message: 'Student Report fetched', reportData: {
                    careerInterestData, personalityData, careerOptions, preferredCareer
                }
            }
        }
        return result
    } catch (error) {
        logger.debug.debug('in career-helper getStudentCareerReport server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

function convertUrlsToLinks(text) {
    // Regular expression to find URLs within text
    const urlRegex = /(https?:\/\/[^\s)]+)/g;

    // Replace URLs with anchor tags
    return text.replace(urlRegex, (url) => {
        // Check if the URL ends with ')' and remove it
        if (url.endsWith(')')) {
            url = url.slice(0, -1); // Remove the last character
        }
        if (url.endsWith('>')) {
            url = url.slice(0, -1); // Remove the last character
        }
        return `<a href="${url}" target="_blank">${url}</a>`;
    });
}

// Function to split text into sections based on the numbering
function splitSections(text) {
    // Regular expression to match valid section headings at the beginning of a line
    const regex = /(?:^|\n)(\d+\.\s)/g;

    // Split the text based on the regex
    const sections = [];
    let lastIndex = 0;
    let match;

    // Iterate over matches to correctly slice the sections
    while ((match = regex.exec(text)) !== null) {
        // Capture the text between the last match and the current match
        const section = text.slice(lastIndex, match.index).trim();
        if (section) {
            sections.push(section);
        }
        // Update lastIndex to the current match
        lastIndex = match.index;
    }
    // Push the final section
    const lastSection = text.slice(lastIndex).trim();
    if (lastSection) {
        sections.push(lastSection);
    }

    return sections;
}

async function savePreferredCareer(input) {
    try {
        logger.debug.debug('in career-helper savePreferredCareer for userid=' + input.userId)

        const res = await saveCareer(input)

        const result = {
            statusCode: httpStatus.OK,
            data: { success: true, message: CAREER_SUCCESS_MSGS.CAREER_SAVED }
        }
        return result
    } catch (error) {
        logger.debug.debug('in career-helper savePreferredCareer server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }
}

async function fetchCareerPreferences(input) {
    try {
        logger.debug.debug('in career-helper fetchCareerPreferences for userid=' + input.userId)

        const res = await getCareerPreferences(input)
        let preferenceData = [];

        res.rows.forEach((element, index) => {
            preferenceData.push({
                careerTitle: element.preferred_career,
                count: element.count,
            });
        });

        const result = {
            statusCode: httpStatus.OK,
            data: { success: true, message: 'Career Preferences retrieved.', preferenceData }
        }
        return result
    } catch (error) {
        logger.debug.debug('in career-helper fetchCareerPreferences server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }
}

async function getCourses(input) {
    try {
        logger.debug.debug('in career-helper getCourses for userid=' + input.userId)

        const tokenData = input.registrationToken.split('_');
        if (tokenData.length != 2) {
            const result = {
                statusCode: httpStatus.BAD_REQUEST,
                data: { success: false, message: 'Invalid registration token' }
            }
            return result
        }
        else {
            const schoolId = tokenData[0];
            const token = tokenData[1];
            const res = await fetchCourses(schoolId, token)

            if (res.rowCount == 0) {
                const result = {
                    statusCode: httpStatus.BAD_GATEWAY,
                    data: { success: false, message: 'Invalid registration token' }
                }
                return result
            } else {
                let courses = [];

                res.rows.forEach((element, index) => {
                    courses.push(element.course);
                });

                const result = {
                    statusCode: httpStatus.OK,
                    data: { success: true, message: 'Courses retrieved.', courses }
                }
                return result
            }
        }

    } catch (error) {
        logger.debug.debug('in career-helper getCourses server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }
}

async function getReportCourses(input) {
    try {
        logger.debug.debug('in career-helper getReportCourses for userid=' + input.userId)

        const res = await fetchReportCourses(input)
        let courseData = [];

        res.rows.forEach((element, index) => {
            courseData.push(element.course);
        });

        const result = {
            statusCode: httpStatus.OK,
            data: { success: true, message: 'Report Courses retrieved.', courseData }
        }
        return result
    } catch (error) {
        logger.debug.debug('in career-helper getReportCourses server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }
}


module.exports = {
    getQuestions, getMobileQuestions, getCareers, getCareerOptions, generateCareerOptions,
    getCareerSteps, getCareerReport, saveCareerAnswers, getStudentCareerReport, savePreferredCareer, fetchCareerPreferences,
    getCourses, getReportCourses
}