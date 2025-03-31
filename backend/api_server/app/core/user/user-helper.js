const bcrypt = require('bcryptjs')
const lc = require('lower-case')
const cryptoRandomString = require('crypto-random-string')
const httpStatus = require('http-status-codes')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const logger = require('../logger/logger')
const nodemailer = require('nodemailer');
const fs = require('fs')
require('dotenv').config()

const { readUser, readUserOTP, updateUserOTP, readUserByUsername, createUser, getTestAnswers,
    getSchoolStudents, getSchoolIdForCounsellorToken, getSchoolIdForStudentToken, getStudentChatByStudentId, saveStudentChatAnswer,
    getTotalStudentsForSchool, getChat, saveUserChat } = require('./user-db-helper')
const { USER_SUCCESS_MSGS, USER_ERROR_MSGS, usernameRegexPattern, passRegexPattern, } = require('./user-constants')
const { INTERNAL_SERVER_ERROR } = require('../../common/common-constants')
const { getCareerChoices } = require('../career/career-db-helper')
const { getPaymentStatusDone } = require('../payment/payment-db-helper')

async function loginUser(input) {
    try { // read user
        logger.debug.debug('in user-helper loginUser by username=' + input.username)
        const username = lc.lowerCase(input.username), password = input.password
        const actualPassword = username + '-' + password
        input.username = username
        const results = await readUser(input)
        logger.debug.debug('in user-helper called readUser by username=' + input.username)
        if (results.rows.length == 1) {
            const userData = results.rows[0]
            const isPassMatch = await bcrypt.compare(actualPassword, userData.user_pwd)
            if (isPassMatch) {
                const token = jwt.sign({ user: { userId: userData.user_id, paymentStatus } }, process.env.API_SECRET, { expiresIn: '24h' })
                const user = { username: username, token: token, name: userData.name }
                const result = { statusCode: httpStatus.OK, data: { success: true, message: USER_SUCCESS_MSGS.AUTH_SUCCESS, user: user } }
                return result
            }
            else {
                const result = { statusCode: httpStatus.UNAUTHORIZED, data: { success: false, message: USER_ERROR_MSGS.AUTH_FAILED } }
                return result
            }
        }
        else {
            const result = { statusCode: httpStatus.UNAUTHORIZED, data: { success: false, message: USER_ERROR_MSGS.AUTH_FAILED } }
            return result
        }
    } catch (error) {
        logger.debug.debug('in user-helper loginUser server error by username=' + input.username + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function loginUserWithOTP(input) {
    try { // read user
        logger.debug.debug('in user-helper loginUserWithOTP by username=' + input.email)
        const username = lc.lowerCase(input.email), otp = input.otp
        if (!otp) {
            const result = { statusCode: httpStatus.UNAUTHORIZED, data: { success: false, message: USER_ERROR_MSGS.OTP_FAILED } }
            return result
        }
        input.username = username
        const results = await readUserOTP(input)
        logger.debug.debug('in user-helper called readUserOTP by username=' + input.username)
        if (results.rows.length == 1) {
            const userData = results.rows[0]
            if (otp == userData.otp) {
                // get payment status for user
                const paymentResult = await getPaymentStatusDone({ userId: userData.user_id });
                let paymentStatus = 'NOT_DONE';
                if (paymentResult.rowCount > 0) {
                    paymentStatus = 'Done';
                }
                const bypassPayment = process.env.BYPASS_PAYMENT
                if (bypassPayment == 'true') {
                    paymentStatus = 'Done';
                }

                const token = jwt.sign({ user: { userId: userData.user_id, isCounsellor: userData.is_counsellor, schoolId: userData.school_id, paymentStatus, isDemoUser: userData.is_demo_user } }, process.env.API_SECRET, { expiresIn: '24h' })
                const user = { username: username, token: token, name: userData.name, isCounsellor: userData.is_counsellor, branch: userData.course }
                let result = { statusCode: httpStatus.OK, data: { success: true, message: USER_SUCCESS_MSGS.AUTH_SUCCESS, user: user, reportGenerated: false, testAnswers: {} } }

                if (process.env.REDIRECT_TO_REPORT == 'true') {
                    // check if career choices already generated
                    const careerResult = await getCareerChoices(userData.user_id);
                    if (careerResult.rowCount == 1) {
                        result.data.reportGenerated = true;
                    }
                }
                // fetch last saved personality and career tests answers if any 
                const testAnswerResults = await getTestAnswers(userData.user_id)
                let testAnswers = {
                    'personalityAnswers': {}, 'careerAnswers': {}
                }
                if (testAnswerResults.rowCount == 1) {
                    testAnswers['personalityAnswers'] = JSON.parse(testAnswerResults.rows[0].personality_answers)
                    testAnswers['careerAnswers'] = JSON.parse(testAnswerResults.rows[0].career_answers)
                }
                // TODO remove later
                testAnswers = {
                    'personalityAnswers': {}, 'careerAnswers': {}
                }
                result.data.testAnswers = testAnswers

                return result
            }
            else {
                const result = { statusCode: httpStatus.UNAUTHORIZED, data: { success: false, message: USER_ERROR_MSGS.OTP_FAILED } }
                return result
            }
        }
        else {
            const result = { statusCode: httpStatus.UNAUTHORIZED, data: { success: false, message: USER_ERROR_MSGS.OTP_FAILED } }
            return result
        }
    } catch (error) {
        logger.debug.debug('in user-helper loginUserWithOTP server error by username=' + input.username + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }
}

async function generateOTP(input) {
    try { // read user
        logger.debug.debug('in user-helper generateOTP by email=' + input.email)
        const email = lc.lowerCase(input.email)

        if (!isEmail(email)) {
            const result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: USER_ERROR_MSGS.INVALID_EMAIL } }
            return result
        } else {
            const results = await readUserByUsername(email)
            logger.debug.debug('in user-helper called readUserByUsername by email=' + email)
            if (results.rows.length != 1) {
                let result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: USER_ERROR_MSGS.USER_NOT_VALID } }
                return result
            } else {
                await generateAndSendOTP(email, '0')
                const result = { statusCode: httpStatus.OK, data: { success: true, message: USER_SUCCESS_MSGS.OTP_GENERATED } }
                return result
            }

        }

    } catch (error) {
        logger.debug.debug('in user-helper generateOTP server error by username=' + input.username + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }
}
async function registerUser(userData) {
    try {
        logger.debug.debug('in user-helper registerUser by username=' + userData.email)
        const errorMessage = validateRegistrationData(userData)
        if (!errorMessage) {
            const username = lc.lowerCase(userData.email)
            userData.email = lc.lowerCase(userData.email)
            const results = await readUserByUsername(username)
            logger.debug.debug('in user-helper called readUserByUsername by username=' + userData.email)
            if (results.rows.length == 1) {
                let result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: USER_ERROR_MSGS.USERNAME_UNAVAILABLE } }
                return result
            }
            else {
                let schoolResult
                const tokenData = userData.registrationToken.split('_');
                if (tokenData.length != 2) {
                    const result = {
                        statusCode: httpStatus.BAD_REQUEST,
                        data: { success: false, message: 'Invalid registration token' }
                    }
                    return result
                }
                const schoolId = tokenData[0];
                const token = tokenData[1];
                if (userData.isCounsellor == '1') {
                    schoolResult = await getSchoolIdForCounsellorToken(schoolId, token)
                } else {
                    schoolResult = await getSchoolIdForStudentToken(schoolId, token)
                }
                logger.debug.debug('in user-helper called schoolResult by registrationToken=' + userData.registrationToken)
                if (schoolResult.rows.length != 1) {
                    let result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: USER_ERROR_MSGS.INVALID_REGISTRATION_TOKEN } }
                    return result
                }
                userData.schoolId = schoolResult.rows[0].school_id
                const studentLimit = schoolResult.rows[0].student_limit
                //check student limit exceeded or not
                const stdResult = await getTotalStudentsForSchool(schoolId)
                const totalStudents = stdResult.rows[0].count
                if (parseInt(totalStudents) >= parseInt(studentLimit)) {
                    let res = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: USER_SUCCESS_MSGS.STUDENT_LIMIT_EXCEEDED } }
                    return res
                }

                // create user with email, mobile and name
                userData.creationDate = new Date(Date.now()).toISOString()
                userData.isCounsellor = userData.isCounsellor == '1' ? 1 : 0
                userData.isDemoUser = schoolResult.rows[0].is_demo_school
                if (userData.isCounsellor == '1') {
                    userData.branch = ''// EMPTY for counsellor
                }
                const returnData = await createUser(userData)
                logger.debug.debug('in user-helper called createUser by username=' + userData.username)
                await generateAndSendOTP(username, userData.isDemoUser)

                let result = { statusCode: httpStatus.CREATED, data: { success: true, message: USER_SUCCESS_MSGS.REGISTER_SUCCESS } }
                return result
            }
        } else {
            const result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: errorMessage } }
            return result
        }
    } catch (error) {
        logger.debug.debug('in user-helper registerUser server error by username=' + userData.username + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }
}

async function changePassword(input) {
    try {
        logger.debug.debug('in user-helper changePassword by userId=' + input.userId)
        const userId = input.userId, currentPassword = input.currentPassword
        const newPassword = input.newPassword, confirmPassword = input.confirmPassword

        const results = await readUserById(userId)

        const errorMessage = validateChangePasswordData(newPassword, confirmPassword)
        // read user
        if (!errorMessage) {
            if (results.rows.length == 1) {
                const userData = results.rows[0]
                const username = lc.lowerCase(userData.username)
                const actualPassword = username + '-' + currentPassword
                // compare password
                const isPassMatch = await bcrypt.compare(actualPassword, userData.user_pwd)
                if (isPassMatch) {
                    const updatedPassword = username + '-' + newPassword
                    const encryptedPass = await bcrypt.hash(updatedPassword, 8)
                    // new password and old password should be different
                    const isOldNewSame = await bcrypt.compare(updatedPassword, userData.user_pwd)
                    if (isOldNewSame) {
                        const result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: USER_ERROR_MSGS.PASSWORD_OLD_NEW_SAME } }
                        return result
                    } else {
                        const data = { userId: userId, password: encryptedPass, lastUpdatedDate: new Date(Date.now()).toISOString() }
                        await updatePassword(data)
                        logger.debug.debug('in user-helper called updatePassword by username=' + input.username)
                        const result = { statusCode: httpStatus.OK, data: { success: true, message: USER_SUCCESS_MSGS.PASSWORD_CHANGED } }
                        return result
                    }

                } else {
                    const result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: USER_ERROR_MSGS.INCORRECT_CURR_PASSWORD } }
                    return result
                }
            }
            else {
                const result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: USER_ERROR_MSGS.INCORRECT_CURR_PASSWORD } }
                return result
            }
        } else {
            const result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: errorMessage } }
            return result
        }
    } catch (error) {
        logger.debug.debug('in user-helper changePassword server error by username=' + input.username + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function forgotPassword(userData) {
    try {
        logger.debug.debug('in user-helper forgotPassword by username=' + userData.username)
        const errorMessage = validateChangePasswordData(userData.password, userData.confirmPassword)
        if (!errorMessage) {
            const username = lc.lowerCase(userData.username)
            const results = await readActiveUserByUsername(username)
            logger.debug.debug('in user-helper called readActiveUserByUsername by username=' + userData.username)
            if (results.rows.length == 1) {
                // if username exists then add entry to password reset table
                const passwordToken = cryptoRandomString({ length: 8, type: 'base64' })
                userData.passwordToken = passwordToken
                // generate password has with combination of username and password
                const actualPassword = username + '-' + userData.password
                const encryptedPass = await bcrypt.hash(actualPassword, 8)
                userData.password = encryptedPass
                userData.dateRequested = new Date(Date.now()).toISOString()
                userData.userId = results.rows[0].user_id
                const updatedData = await updatePasswordResetRequest(userData)
                logger.debug.debug('in user-helper called updatePasswordResetRequest by username=' + userData.username)
                // if no existing record then create new record.
                if (updatedData.rowCount == 0) {
                    await addPasswordResetRequest(userData)
                    logger.debug.debug('in user-helper called addPasswordResetRequest by username=' + userData.username)
                }
                let result = { statusCode: httpStatus.OK, data: { success: true, message: USER_SUCCESS_MSGS.PASSWORD_RESET_SUBMIT, passwordToken: passwordToken } }
                return result
            }
            else {
                // username doesn't exist
                const result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: USER_ERROR_MSGS.INVALID_USERNAME } }
                return result
            }
        } else {
            const result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: errorMessage } }
            return result
        }
    } catch (error) {
        logger.debug.debug('in user-helper forgotPassword server error by username=' + userData.username + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }
}

/*function validateRegistrationData(userData) {
    const { username, password, confirmPassword } = userData
    let errorMessage

    const usernameRegex = usernameRegexPattern
    if (!username.match(usernameRegex)) {
        errorMessage = USER_ERROR_MSGS.INVALID_USERNAME
    }
    const passRegex = RegExp(passRegexPattern)
    if (!passRegex.test(password)) {
        errorMessage = USER_ERROR_MSGS.PASSWORD_NOT_STRONG
    }
    if (password != confirmPassword) {
        errorMessage = USER_ERROR_MSGS.PASSWORD_CONFIRM_PASS_MISMATCH
    }
    return errorMessage
}*/

function validateChangePasswordData(newPassword, confirmPassword) {
    let errorMessage
    const passRegex = RegExp(passRegexPattern)
    if (!passRegex.test(newPassword)) {
        errorMessage = USER_ERROR_MSGS.PASSWORD_NOT_STRONG
    }
    if (newPassword != confirmPassword) {
        errorMessage = USER_ERROR_MSGS.PASSWORD_CONFIRM_PASS_MISMATCH
    }
    return errorMessage
}

function validateRegistrationData(userData) {
    const { email, name, mobile } = userData
    let errorMessage

    if (!isEmail(email)) {
        errorMessage = USER_ERROR_MSGS.INVALID_EMAIL
    }

    if (!name) {
        errorMessage = USER_ERROR_MSGS.EMPTY_NAME
    }
    if (!isMobile(mobile)) {
        errorMessage = USER_ERROR_MSGS.INVALID_MOBILE
    }
    return errorMessage
}

function isEmail(email) {
    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(email);
}

function isMobile(mobile) {
    return mobile.match('[0-9]{10}');
}

async function generateAndSendOTP(email, isDemoUser) {
    let otp;
    if (isDemoUser == '1') {
        otp = 123123
    } else {
        otp = Math.floor(100000 + Math.random() * 900000)
    }
    let input = { otp: otp, username: email }
    const results = await updateUserOTP(input)
    logger.debug.debug('sending generating otp by username=' + input.username)
    /*let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'email.career.logy@gmail.com',
            pass: 'ybptuxtslnhbiemq'
        }
    });*/

    let mailTransporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com', // Use Hostinger's SMTP server hostname
        port: 465, // SMTP port (587 is commonly used for SMTP)
        secure: true, // Set to true if you're using SSL/TLS
        auth: {
            user: 'support@bytrait.com',
            pass: 'C@reer10gy'
        }
    });

    var mailOptions = {
        from: 'support@bytrait.com',
        to: email,
        subject: 'Bytrait OTP for login',
        text: 'OTP for login is ' + otp,
        html: 'Your OTP for login is <b>' + otp + '</b>.',
    }
    mailTransporter.sendMail(mailOptions, function (err, data) {

        if (err) {
            console.log('Error in sending email ' + err)
        } else {
            console.log('Email sent successfully')
        }
    });

}

async function getStudentsForSchool(input) {
    try {
        logger.debug.debug('in user-helper getStudentsForSchool by userId=' + input.userId)
        const results = await getSchoolStudents(input)

        let students = [], student
        for (let i = 0; i < results.rowCount; i++) {
            student = {
                'studentId': results.rows[i].user_id,
                'studentName': results.rows[i].name,
                'email': results.rows[i].username,
                'mobile': results.rows[i].mobile,
                'isReportAvailable': results.rows[i].is_report_available,
                'branch': results.rows[i].course,
            }
            students.push(student)
        }
        const result = { statusCode: httpStatus.OK, data: { success: true, message: USER_SUCCESS_MSGS.STUDENTS_RETRIEVED, students: students } }
        return result

    } catch (error) {
        logger.debug.debug('in user-helper getStudentsForSchool server error by userId=' + input.userId + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function getStudentChat(input) {
    try {
        logger.debug.debug('in user-helper getStudentChat by counsellor=' + input.counsellorId)
        const results = await getStudentChatByStudentId(input)

        let chat = {}
        if (results.rowCount > 0) {
            chat = {
                'question1': results.rows[0].question1,
                'answer1': results.rows[0].answer1,
                'question1Date': results.rows[0].question1_date,

                'question2': results.rows[0].question2,
                'answer2': results.rows[0].answer2,
                'question2Date': results.rows[0].question2_date,

                'question3': results.rows[0].question3,
                'answer3': results.rows[0].answer3,
                'question3Date': results.rows[0].question3_date,
            }
        }
        const result = { statusCode: httpStatus.OK, data: { success: true, message: USER_SUCCESS_MSGS.CHAT_RETRIEVED, chat: chat } }
        return result

    } catch (error) {
        logger.debug.debug('in user-helper getStudentChat server error by counsellorId=' + input.counsellorId + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function getChatAnswer(input) {
    try {
        logger.debug.debug('in user-helper getChatAnswer by counsellor=' + input.counsellorId)

        // get answer from chat gpt
        const postData = { counsellorId: input.counsellorId, question: input.question }
        const gptResponse = await axios.post(`${process.env.ML_API_URL}` + "/chat_answer", postData)
        const answer = gptResponse.data.response

        const queryData = {
            question: input.question,
            questionNumber: input.questionNumber,
            counsellorId: input.counsellorId,
            studentId: input.studentId,
            answer: answer,
            dateCreated: new Date(Date.now()).toISOString()
        }
        const results = await saveStudentChatAnswer(queryData)

        // get chat
        const resultChat = await getStudentChatByStudentId(input)

        let chat = {}
        if (resultChat.rowCount > 0) {
            chat = {
                'question1': resultChat.rows[0].question1,
                'answer1': resultChat.rows[0].answer1,
                'question1Date': resultChat.rows[0].question1_date,

                'question2': resultChat.rows[0].question2,
                'answer2': resultChat.rows[0].answer2,
                'question2Date': resultChat.rows[0].question2_date,

                'question3': resultChat.rows[0].question3,
                'answer3': resultChat.rows[0].answer3,
                'question3Date': resultChat.rows[0].question3_date,
            }
        }

        const result = { statusCode: httpStatus.OK, data: { success: true, message: USER_SUCCESS_MSGS.CHAT_ANSWER_RETRIEVED, chat: chat } }
        return result

    } catch (error) {
        logger.debug.debug('in user-helper getChatAnswer server error by counsellorId=' + input.counsellorId + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function getUserChat(input) {
    try {
        logger.debug.debug('in user-helper getUserChat by userID=' + input.userId)
        const results = await getChat(input)

        let chatData, tokenUsed;
        if (results.rowCount > 0) {
            chatData = JSON.parse(results.rows[0].chats);
            tokenUsed = results.rows[0].total_token_used
        }
        const result = { statusCode: httpStatus.OK, data: { success: true, message: USER_SUCCESS_MSGS.CHAT_RETRIEVED, chatData: chatData, tokenUsed: tokenUsed } }
        return result

    } catch (error) {
        logger.debug.debug('in user-helper getUserChat server error by userId=' + input.userId + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function getUserChatAnswer(input) {
    try {
        logger.debug.debug('in user-helper getUserChatAnswer by userId=' + input.userId)

        // get answer from chat gpt
        const postData = { userId: input.userId, question: input.question }
        const gptResponse = await axios.post(`${process.env.ML_API_URL}` + "/chat_answer", postData)
        const answer = gptResponse.data.response.replace(/mistral/gi, 'ByTrait');

        const queryData = {
            userId: input.userId,
            question: input.question,
            answer: answer,
            chatTime: new Date(Date.now()).toISOString(),
            newChat: JSON.stringify({
                chatHistory: [
                    {
                        question: input.question,
                        answer: answer,
                        chatTime: new Date(Date.now()).toISOString()
                    }
                ]
            })
        }

        const results = await saveUserChat(queryData)

        // get chat
        const resultChat = await getChat(input)

        let chatData, tokenUsed;
        if (resultChat.rowCount > 0) {
            chatData = JSON.parse(resultChat.rows[0].chats);
            tokenUsed = resultChat.rows[0].total_token_used
        }
        const result = { statusCode: httpStatus.OK, data: { success: true, message: USER_SUCCESS_MSGS.CHAT_ANSWER_RETRIEVED, chatData: chatData, tokenUsed: tokenUsed } }
        return result

    } catch (error) {
        logger.debug.debug('in user-helper getUserChatAnswer server error by userId=' + input.userId + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}


module.exports = {
    loginUser, loginUserWithOTP, generateOTP, registerUser, changePassword, forgotPassword, getStudentsForSchool,
    getStudentChat, getChatAnswer, getUserChat, getUserChatAnswer
}