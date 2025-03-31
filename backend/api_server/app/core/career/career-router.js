const express = require('express')
const httpStatus = require('http-status-codes')
const logger = require('../logger/logger')
const router = express.Router()

const { getAllQuestions, getAllMobileQuestions, getAllCareers, getAllCareerOptions, generateCareerChoices,
    getAllCareerSteps, getUserCareerReport, saveAllCareerAnswers, getStudentReportData, saveCareer,
    getCareerPreferences, fetchCourses, fetchReportCourses } = require('./career-service')

router.route('/questions').get(getQuestions)
router.route('/mobile-questions').get(getMobileQuestions)
router.route('/careers').post(getCareers)
router.route('/careers-options').get(getCareerOptions)
router.route('/generate-careers').post(generateCareerOptions)
router.route('/careers-steps').get(getCareerSteps)
router.route('/careersGet').get(getCareersGet)
router.route('/career-report').get(getCareerReport)
router.route('/career/save-answers').post(saveCareerAnswers)
router.route('/student/career-report').get(getStudentCareerReport)
router.route('/save-preferred-career').post(savePreferredCareer)
router.route('/get-career-preferences').get(fetchCareerPreferences)
router.route('/get-courses').get(getCourses)
router.route('/get-report-courses').get(getReportCourses)


async function getQuestions(request, response) {
    logger.debug.info('Before getQuestions called')
    const isDemoUser = request.query.isDemoUser
    const input = { isDemoUser }
    const result = await getAllQuestions(input)
    logger.debug.info('After getQuestions called')
    logger.debug.debug('Response by getQuestions result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function getMobileQuestions(request, response) {
    logger.debug.info('Before getMobileQuestions called')
    const isDemoUser = request.query.isDemoUser
    const input = { isDemoUser }
    const result = await getAllMobileQuestions(input)
    logger.debug.info('After getMobileQuestions called')
    logger.debug.debug('Response by getMobileQuestions result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function getCareers(request, response) {
    logger.debug.info('Before getCareers called')
    //const anwsers = request.query.answers
    const userId = request.query.userId
    const isDemoUser = request.query.isDemoUser
    const answers = request.body.answers
    const input = { userId, answers, isDemoUser }
    const result = await getAllCareers(input)
    logger.debug.info('After getCareers called')
    logger.debug.debug('Response by getCareers result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function getCareersGet(request, response) {
    logger.debug.info('Before getCareers called')
    const anwsersQuery = request.query.answers
    let answers = {}
    for (let i = 1; i <= 50; i++) {
        answers[i] = anwsersQuery.substring(i - 1, i)
    }
    const result = await getAllCareers(answers)
    logger.debug.info('After getCareersGet called')
    logger.debug.debug('Response by getCareersGet result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function getCareerReport(request, response) {
    logger.debug.info('Before getCareerReport called')
    const userId = request.query.userId
    const result = await getUserCareerReport(userId)
    logger.debug.info('After getCareerReport called')
    logger.debug.debug('Response by getCareerReport result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function getStudentCareerReport(request, response) {
    logger.debug.info('Before getStudentCareerReport called')
    const counsellorId = request.query.userId
    const studentId = request.query.studentId
    const schoolId = request.query.schoolId
    const input = { counsellorId, studentId, schoolId }
    const result = await getStudentReportData(input)
    logger.debug.info('After getStudentCareerReport called')
    logger.debug.debug('Response by getStudentCareerReport result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function getCareerOptions(request, response) {
    logger.debug.info('Before getCareerOptions called')
    const userId = request.query.userId
    const result = await getAllCareerOptions(userId)
    logger.debug.info('After getCareerOptions called')
    logger.debug.debug('Response by getCareerOptions result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function getCareerSteps(request, response) {
    logger.debug.info('Before getCareerSteps called')
    let userId = request.query.userId
    if (request.query.studentId != 'null') {
        // In case of admin/counsellor login student id will be provided. Use that id as userId
        userId = request.query.studentId
    }
    const careerTitle = request.query.careerTitle
    const input = { userId, careerTitle }
    const result = await getAllCareerSteps(input)
    logger.debug.info('After getCareerSteps called')
    logger.debug.debug('Response by getCareerSteps result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function generateCareerOptions(request, response) {
    logger.debug.info('Before generateCareerOptions called')
    const userId = request.query.userId
    const input = { userId, careerData: request.body.careerData }
    const result = await generateCareerChoices(input)
    logger.debug.info('After generateCareerOptions called')
    logger.debug.debug('Response by generateCareerOptions result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function savePreferredCareer(request, response) {
    logger.debug.info('Before savePreferredCareer called')
    const userId = request.query.userId
    const schoolId = request.query.schoolId
    const input = { userId, schoolId, careerTitle: request.body.careerTitle, course: request.body.course }
    const result = await saveCareer(input)
    logger.debug.info('After savePreferredCareer called')
    logger.debug.debug('Response by savePreferredCareer result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function saveCareerAnswers(request, response) {
    logger.debug.info('Before saveCareerAnswers called')
    //const anwsers = request.query.answers
    const userId = request.query.userId
    const answers = request.body.answers
    const input = { userId, answers }
    const result = await saveAllCareerAnswers(input)
    logger.debug.info('After saveCareerAnswers called')
    logger.debug.debug('Response by saveCareerAnswers result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function fetchCareerPreferences(request, response) {
    logger.debug.info('Before fetchCareerPreferences called')
    const userId = request.query.userId
    const schoolId = request.query.schoolId
    const course = request.query.branch
    const input = { userId, schoolId, course }
    const result = await getCareerPreferences(input)
    logger.debug.info('After fetchCareerPreferences called')
    logger.debug.debug('Response by fetchCareerPreferences result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function getCourses(request, response) {
    logger.debug.info('Before getCourses called')
    const userId = request.query.userId
    const registrationToken = request.query.registrationToken
    const input = { userId, registrationToken }
    const result = await fetchCourses(input)
    logger.debug.info('After getCourses called')
    logger.debug.debug('Response by getCourses result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function getReportCourses(request, response) {
    logger.debug.info('Before getReportCourses called')
    const userId = request.query.userId
    const schoolId = request.query.schoolId
    const input = { userId, schoolId }
    const result = await fetchReportCourses(input)
    logger.debug.info('After getReportCourses called')
    logger.debug.debug('Response by getReportCourses result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

module.exports = router