const { getQuestions, generatePersonalityTestResults, get50Questions, generate50PersonalityTestResults, savePersonalityAnswers } = require('./personality-helper')

const getPersonalityQuestions = async (input) => {
    const result = await getQuestions(input)
    return result
}

const get50PersonalityQuestions = async (input) => {
    const result = await get50Questions(input)
    return result
}

const generateTestResults = async (input) => {
    const result = await generatePersonalityTestResults(input)
    return result
}

const generate50TestResults = async (input) => {
    const result = await generate50PersonalityTestResults(input)
    return result
}

const saveAllPersonalityAnswers = async (input) => {
    const result = await savePersonalityAnswers(input)
    return result
}

module.exports = { getPersonalityQuestions, generateTestResults, get50PersonalityQuestions, generate50TestResults, saveAllPersonalityAnswers }