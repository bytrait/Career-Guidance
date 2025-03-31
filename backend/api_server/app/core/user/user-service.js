const { loginUser, loginUserWithOTP, generateOTP, registerUser, changePassword, forgotPassword, 
    getStudentsForSchool, getStudentChat, getChatAnswer, getUserChat, getUserChatAnswer } = require('./user-helper')

const login = async (input) => {
    const result = await loginUser(input)
    return result
}

const loginWithOTP = async (input) => {
    const result = await loginUserWithOTP(input)
    return result
}

const generateUserOTP = async (input) => {
    const result = await generateOTP(input)
    return result
}

const register = async (input) => {
    const result = await registerUser(input)
    return result
}

const changeUserPassword = async (input) => {
    const result = await changePassword(input)
    return result
}

const forgotPwd = async (input) => {
    const result = await forgotPassword(input)
    return result
}

const getAllStudentsForSchool = async (input) => {
    const result = await getStudentsForSchool(input)
    return result
}

const getStudentChatByStudentId = async (input) => {
    const result = await getStudentChat(input)
    return result
}

const getChatAnswerForStudent = async (input) => {
    const result = await getChatAnswer(input)
    return result
}

const getChat = async (input) => {
    const result = await getUserChat(input)
    return result
}

const getChatAnswerForUser = async (input) => {
    const result = await getUserChatAnswer(input)
    return result
}

module.exports = { login, loginWithOTP, generateUserOTP,  register, changeUserPassword, forgotPwd, getAllStudentsForSchool,
    getStudentChatByStudentId, getChatAnswerForStudent, getChat, getChatAnswerForUser }