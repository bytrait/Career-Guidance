const { getQuestions, getMobileQuestions, getCareers, getCareerOptions, generateCareerOptions,
    getCareerSteps, getCareerReport, saveCareerAnswers, getStudentCareerReport, savePreferredCareer, fetchCareerPreferences,
    getCourses, getReportCourses } = require('./career-helper')

const getAllQuestions = async (input) => {
    const result = await getQuestions(input)
    return result
}

const getAllMobileQuestions = async (input) => {
    const result = await getMobileQuestions(input)
    return result
}

const getAllCareers = async (input) => {
    const result = await getCareers(input)
    return result
}

const getAllCareerOptions = async (userId) => {
    const result = await getCareerOptions(userId)
    return result
}

const generateCareerChoices = async (input) => {
    const result = await generateCareerOptions(input)
    return result
}

const getAllCareerSteps = async (input) => {
    const result = await getCareerSteps(input)
    return result
}

const getUserCareerReport = async (input) => {
    const result = await getCareerReport(input)
    return result
}

const saveAllCareerAnswers = async (input) => {
    const result = await saveCareerAnswers(input)
    return result
}

const getStudentReportData = async (input) => {
    const result = await getStudentCareerReport(input)
    return result
}

const saveCareer = async (input) => {
    const result = await savePreferredCareer(input)
    return result
}

const getCareerPreferences = async (input) => {
    const result = await fetchCareerPreferences(input)
    return result
}

const fetchCourses = async (input) => {
    const result = await getCourses(input)
    return result
}

const fetchReportCourses = async (input) => {
    const result = await getReportCourses(input)
    return result
}


module.exports = {
    getAllQuestions, getAllCareers, getAllMobileQuestions, getAllCareerOptions, generateCareerChoices,
    getAllCareerSteps, getUserCareerReport, saveAllCareerAnswers, getStudentReportData, saveCareer, getCareerPreferences, fetchCourses,
    fetchReportCourses
}