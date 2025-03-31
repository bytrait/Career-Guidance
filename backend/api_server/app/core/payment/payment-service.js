const { createOrder, recordOrder, checkPaymentStatus, cancelPayment } = require('./payment-helper')

const createPaymentOrder = async (input) => {
    const result = await createOrder(input)
    return result
}

const recordPaymentOrder = async (input) => {
    const result = await recordOrder(input)
    return result
}

const getPaymentStatus = async (input) => {
    const result = await checkPaymentStatus(input)
    return result
}

const cancelUserPayment = async (input) => {
    const result = await cancelPayment(input)
    return result
}


module.exports = { createPaymentOrder, recordPaymentOrder, getPaymentStatus, cancelUserPayment }