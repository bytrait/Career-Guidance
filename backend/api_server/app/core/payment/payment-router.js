const express = require('express')
const router = express.Router()
const logger = require('../logger/logger')
const { createPaymentOrder, recordPaymentOrder, getPaymentStatus, cancelUserPayment } = require('./payment-service')


router.route('/createOrder').post(createOrder)
router.route('/recordPayment').post(recordPayment)
router.route('/paymentStatus').get(checkPaymentStatus)
router.route('/cancelPayment').post(cancelPayment)

async function checkPaymentStatus(request, response) {
    const userId = request.query.userId;
    const input = { userId }
    const result = await getPaymentStatus(input);
    response.status(result.statusCode).json(result.data);
}

async function createOrder(request, response) {
    const userId = request.query.userId;
    const input = { userId: userId, amount: request.body.amount, username: request.body.username }
    const result = await createPaymentOrder(input);
    response.status(result.statusCode).json(result.data);
}

async function recordPayment(request, response) {
    let input = request.body;
    input.userId = request.query.userId;
    const result = await recordPaymentOrder(input);
    response.status(result.statusCode).json(result.data);
}

async function cancelPayment(request, response) {
    const input = { orderId: request.body.orderId, userId: request.query.userId }
    const result = await cancelUserPayment(input);
    response.status(result.statusCode).json(result.data);
}

module.exports = router
