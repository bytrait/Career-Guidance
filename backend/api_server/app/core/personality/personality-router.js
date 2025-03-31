const express = require('express')
const httpStatus = require('http-status-codes')
const logger = require('../logger/logger')
const router = express.Router()

const { getPersonalityQuestions, generateTestResults, get50PersonalityQuestions, generate50TestResults, saveAllPersonalityAnswers } = require('./personality-service')

router.route('/personality/questions').get(getQuestions)
router.route('/personality/answers').post(generatePersonalityTestResults)

router.route('/personality/questions50').get(get50Questions)
router.route('/personality/answers50').post(generate50PersonalityTestResults)
router.route('/personality/answers50Get').get(generate50PersonalityTestResultsGet)
router.route('/personality/save-answers').post(savePersonalityAnswers)


async function getQuestions(request, response) {
    logger.debug.info('Before getQuestions called')
    const isDemoUser = request.query.isDemoUser
    const input = { isDemoUser }
    const result = await getPersonalityQuestions(input)
    logger.debug.info('After getQuestions called')
    logger.debug.debug('Response by getQuestions result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function get50Questions(request, response) {
    logger.debug.info('Before get50Questions called')
    const isDemoUser = request.query.isDemoUser
    const input = { isDemoUser }
    const result = await get50PersonalityQuestions(input)
    logger.debug.info('After get50Questions called')
    logger.debug.debug('Response by get50Questions result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function generatePersonalityTestResults(request, response) {
    const input = { answers: request.body.answers, isDemoUser: request.query.isDemoUser }
    const result = await generateTestResults(input)
    response.status(result.statusCode).json(result.data)
}

async function generate50PersonalityTestResults(request, response) {
    const userId = request.query.userId
    const input = { userId, answers: request.body.answers, isDemoUser: request.query.isDemoUser }
    const result = await generate50TestResults(input)
    response.status(result.statusCode).json(result.data)
}


async function savePersonalityAnswers(request, response) {
    const userId = request.query.userId
    const input = { userId, answers: request.body.answers }
    const result = await saveAllPersonalityAnswers(input)
    response.status(result.statusCode).json(result.data)
}

async function generate50PersonalityTestResultsGet(request, response) {

    const anwsersQuery = request.query.answers
    let answers = {}
    for (let i = 1; i <= 50; i++) {
        answers[i] = anwsersQuery.substring(i - 1, i)
    }
    const input = { answers: answers }
    const result = await generate50TestResults(input)
    response.status(result.statusCode).json(result.data)
}

module.exports = router