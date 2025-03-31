const express = require('express')
const httpStatus = require('http-status-codes')
const router = express.Router()
const logger = require('../logger/logger')
const { login, loginWithOTP, generateUserOTP, register, changeUserPassword, forgotPwd, getAllStudentsForSchool,
    getStudentChatByStudentId, getChatAnswerForStudent, getChat, getChatAnswerForUser } = require('./user-service')
const { USER_SUCCESS_MSGS } = require('./user-constants')

router.route('/login').post(loginUser)
router.route('/loginWithOTP').post(loginUserWithOTP)
router.route('/logout').post(logoutUser)
router.route('/generateOTP').post(generateOTP)
router.route('/register').post(registerUser)
router.route('/change-password').post(changePassword)
router.route('/forgot-password').post(forgotPassword)
router.route('/students').get(getStudentsForSchool)
router.route('/studentChat').get(getStudentChat)
router.route('/chatAnswer').get(getChatAnswer)
router.route('/userChat').get(getUserChat)
router.route('/userChatAnswer').get(getUserChatAnswer)

async function loginUser(request, response) {
    const username = request.body.username
    const password = request.body.password
    const input = { username, password }
    logger.debug.info('Before loginUser called by username=' + username)
    const result = await login(input)
    logger.debug.info('After loginUser called by username=' + username)
    logger.debug.debug('Response by loginUser username=' + username + ', result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function loginUserWithOTP(request, response) {
  const email = request.body.email;
  const otp = request.body.otp;
  const input = { email, otp };
  logger.debug.info("Before loginUserWithOTP called by email=" + email);
  const result = await loginWithOTP(input);
  logger.debug.info("After loginUserWithOTP called by email=" + email);
  logger.debug.debug(
    "Response by loginUserWithOTP email=" +
      email +
      ", result.statusCode=" +
      result.statusCode +
      ", result.data=" +
      JSON.stringify(result.data)
  );
  if (result.statusCode === 200 && result.data.user.token) {
    const token = result.data.user.token;

    response.cookie("user-details", token, {
      domain: ".bytrait.com",
      httpOnly: false,
      secure: false, // Set to false for localhost, true for production
      sameSite: "Lax",
      path: "/",
    });

    // Also send in the response body (for existing frontend logic)
    result.data.session_token = token;
  }

  response.status(result.statusCode).json(result.data);
}

async function logoutUser(request, response) {
  const userId = request.query.userId;
  logger.debug.info("Before logoutUser called by userId=" + userId);
  delete request.headers["authorization"];
  result = {
    statusCode: httpStatus.OK,
    data: { success: true, message: USER_SUCCESS_MSGS.LOGOUT_SUCCESS },
  };
  logger.debug.info("After logoutUser called by userId=" + userId);
  logger.debug.debug(
    "Response by logoutUser userId=" +
      userId +
      ", result.statusCode=" +
      result.statusCode +
      ", result.data=" +
      JSON.stringify(result.data)
  );
  response.clearCookie("user-details", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  response.status(result.statusCode).json(result.data);
}

async function generateOTP(request, response) {
    const email = request.body.email
    const input = { email }
    logger.debug.info('Before generateOTP called by email=' + email)
    const result = await generateUserOTP(input)
    logger.debug.info('After generateOTP called by email=' + email)
    logger.debug.debug('Response by generateOTP email=' + email + ', result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function registerUser(request, response) {
    const input = request.body
    logger.debug.info('Before registerUser username=' + input.email)
    const result = await register(input)
    logger.debug.info('After registerUser  email=' + input.email)
    logger.debug.debug('Response by registerUser email=' + input.email + ', result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function changePassword(request, response) {
    let input = request.body.data
    input.userId = request.query.userId
    logger.debug.info('Before changePassword called by userId=' + input.userId)
    const result = await changeUserPassword(input)
    logger.debug.info('After changePassword called by userId=' + input.userId)
    logger.debug.debug('Response by changePassword userId=' + input.userId + ', result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function forgotPassword(request, response) {
    const input = request.body.data
    logger.debug.info('Before forgotPassword called by username=' + input.username)
    const result = await forgotPwd(input)
    logger.debug.info('After forgotPassword called by username=' + input.username)
    logger.debug.debug('Response by forgotPassword username=' + input.username + ', result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function getStudentsForSchool(request, response) {
    const schoolId = request.query.schoolId
    const userId = request.query.userId
    const input = { schoolId, userId }
    logger.debug.info('Before getStudentsForSchool called by userid=' + userId)
    const result = await getAllStudentsForSchool(input)
    logger.debug.info('After getStudentsForSchool called by userid=' + userId)
    logger.debug.debug('Response by getStudentsForSchool userid=' + userId + ', result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function getStudentChat(request, response) {
    const studentId = request.query.studentId
    const counsellorId = request.query.userId
    const input = { studentId, counsellorId }
    logger.debug.info('Before getStudentChat called by counsellorId=' + counsellorId)
    const result = await getStudentChatByStudentId(input)
    logger.debug.info('After getStudentChat called by counsellorId=' + counsellorId)
    logger.debug.debug('Response by getStudentChat counsellorId=' + counsellorId + ', result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function getUserChat(request, response) {
    const userId = request.query.userId
    const input = { userId }
    logger.debug.info('Before getUserChat called by userID=' + userId)
    const result = await getChat(input)
    logger.debug.info('After getUserChat called by userId=' + userId)
    logger.debug.debug('Response by getUserChat userId=' + userId + ', result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}


async function getChatAnswer(request, response) {
    const studentId = request.query.studentId
    const question = request.query.question
    const questionNumber = request.query.questionNumber
    const counsellorId = request.query.userId
    const input = { studentId, counsellorId, question, questionNumber }
    logger.debug.info('Before getChatAnswer called by counsellorId=' + counsellorId)
    const result = await getChatAnswerForStudent(input)
    logger.debug.info('After getChatAnswer called by counsellorId=' + counsellorId)
    logger.debug.debug('Response by getChatAnswer counsellorId=' + counsellorId + ', result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}

async function getUserChatAnswer(request, response) {
    const question = request.query.question
    const userId = request.query.userId
    const input = { userId, question }
    logger.debug.info('Before getUserChatAnswer called by userId=' + userId)
    const result = await getChatAnswerForUser(input)
    logger.debug.info('After getUserChatAnswer called by userId=' + userId)
    logger.debug.debug('Response by getUserChatAnswer userId=' + userId + ', result.statusCode=' + result.statusCode + ', result.data=' + JSON.stringify(result.data))
    response.status(result.statusCode).json(result.data)
}



module.exports = router
