const httpStatus = require('http-status-codes')
const jwt = require('jsonwebtoken')
const logger = require('../core/logger/logger')

const { INVALID_SESSION, ACCESS_FORBIDDEN, NO_PAYMENT } = require('../common/common-constants')

const urlsWithoutAuth = [
    '/api/v1/heartbeat', '/api/v1/error-check', '/api/v1/login', '/api/v1/loginWithOTP', '/api/v1/generateOTP', '/api/v1/register',
    //'/favicon.ico', '/api/v1/questions', '/api/v1/personality/questions', '/api/v1/personality/answers']
    '/favicon.ico', '/api/v1/careersGet', '/api/v1/personality/answers50Get', 'api/v1/get-courses']

const authConstants = {
    logoutUrl: '/api/v1/logout',
    authTokenHeaderName: 'authorization'
}

const counsellorUrls = [
    '/api/v1/students', '/api/v1/student/career-report'
]

const urlsWithPayments = [
    '/api/v1/questions',
    '/api/v1/mobile-questions',
    '/api/v1/careers',
    '/api/v1/careers-options',
    '/api/v1/generate-careers',
    '/api/v1/save-preferred-career',
    '/api/v1/careers-steps',
    '/api/v1/careersGet',
    '/api/v1/career-report',
    '/api/v1/career/save-answers',
    '/api/v1/personality/questions',
    '/api/v1/personality/answers',
    '/api/v1/personality/questions50',
    '/api/v1/personality/answers50',
    '/api/v1/personality/answers50Get',
    '/api/v1/personality/save-answers',
]

module.exports = function () {
    return function (req, res, next) {
        if (!req.url.startsWith('/api')) {
            next()
        }
        //else if (urlsWithoutAuth.includes(req.url) || req.url.indexOf('/api/v1/careersGet') != -1 || req.url.indexOf('/api/v1/personality/answers50Get') != -1) {
        else if (urlsWithoutAuth.includes(req.url) || req.url.indexOf('api/v1/get-courses') != -1) {
            res.set('X-Frame-Options', 'sameorigin')
            res.set('Cache-control', 'no-cache')
            res.set('X-XSS-Protection', '1; mode=block')
            res.set('X-Content-Type-Options', 'nosniff')
            res.set('Strict-Transport-Security', 'max-age=7776000')
            res.set('Referrer-Policy', 'same-origin')
            res.removeHeader('X-Powered-By')
            next()
        } else {
            const token = req.headers[authConstants.authTokenHeaderName]
            try {
                const payload = jwt.verify(token, process.env.API_SECRET)
                req.query.userId = payload.user.userId
                req.query.isCounsellor = payload.user.isCounsellor
                req.query.schoolId = payload.user.schoolId
                req.query.isDemoUser = payload.user.isDemoUser
                if (counsellorUrls.includes(req.url) && payload.user.isCounsellor != '1') {
                    logger.debug.info('Time: ', Date.now() + ' access forbidden for url' + req.url + ' for userid ' + req.query.userId)
                    const result = { statusCode: 403, data: { success: false, message: ACCESS_FORBIDDEN } }
                    res.status(result.statusCode).json(result.data)
                } else {
                    // check url with payments
                    if (urlsWithPayments.includes(req.url)) {
                        if (payload.user.paymentStatus === 'Done') {
                            res.set('X-Frame-Options', 'sameorigin')
                            res.set('Cache-control', 'no-cache')
                            res.set('X-XSS-Protection', '1; mode=block')
                            res.set('X-Content-Type-Options', 'nosniff')
                            res.set('Strict-Transport-Security', 'max-age=7776000')
                            res.set('Referrer-Policy', 'same-origin')
                            res.removeHeader('X-Powered-By')
                            next()
                        } else {
                            logger.debug.info('Time: ', Date.now() + ' access forbidden because of no payment for url' + req.url + ' for userid ' + req.query.userId)
                            const result = { statusCode: 403, data: { success: false, message: NO_PAYMENT } }
                            res.status(result.statusCode).json(result.data)
                        }

                    } else {
                        res.set('X-Frame-Options', 'sameorigin')
                        res.set('Cache-control', 'no-cache')
                        res.set('X-XSS-Protection', '1; mode=block')
                        res.set('X-Content-Type-Options', 'nosniff')
                        res.set('Strict-Transport-Security', 'max-age=7776000')
                        res.set('Referrer-Policy', 'same-origin')
                        res.removeHeader('X-Powered-By')
                        next()
                    }
                }

            } catch (error) {
                if (req.url != authConstants.logoutUrl) {
                    logger.debug.info('Time: ', Date.now() + ' error: ' + error + ' url:' + req.url)
                    const result = { statusCode: 440, data: { success: false, message: INVALID_SESSION } }
                    res.status(result.statusCode).json(result.data)
                }
            }
        }
    }
}