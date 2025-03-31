const express = require('express')
const httpStatus = require('http-status-codes')
const router = express.Router()

const { SERVER_RUNNING } = require('../common/common-constants')

router.route('/heartbeat').get(heartbeat)
router.route('/error-check').get(checkError)

async function heartbeat(req, res) {
    result = { statusCode: httpStatus.OK, data: { success: true, message: SERVER_RUNNING } }
    res.status(result.statusCode).json(result.data)
}

async function checkError(req, res, next) {
    next(new Error('some error has occured'))
}

module.exports = router