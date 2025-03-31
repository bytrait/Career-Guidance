const { pool } = require('../../db-config')
require('dotenv').config()


async function createPaymentRecord(input) {
    const query = 'insert into payments (user_id,order_id, receipt_number,amount, payment_status) values ($1,$2,$3,$4,$5)'
    const paymentStatus = 'In-Progress'
    const results = await pool.query(query, [input.userId, input.orderId, input.receiptNumber, input.amount, paymentStatus])
    return results
}

async function updatePaymentRecord(input) {
    const query = 'update payments set razorpay_order_id=$1, razorpay_payment_id=$2, razorpay_signature=$3, payment_status=$4 where user_id=$5 and order_id=$6'
    const results = await pool.query(query, [input.razorpayOrderId, input.razorpayPaymentId, input.razorpaySignature, input.paymentStatus, input.userId, input.razorpayOrderId])
    return results
}

async function getPaymentStatusDone(input) {
    const paymentStatus = 'Done';
    const query = 'select payment_status from payments where user_id=$1 and payment_status=$2'
    const results = await pool.query(query, [input.userId, paymentStatus])
    return results
}

async function cancelUserPayment(input) {
    const paymentStatus = 'Cancelled';
    const query = 'update payments set payment_status=$1 where order_id=$2 and user_id=$3'
    const results = await pool.query(query, [paymentStatus, input.orderId, input.userId])
    return results
}

module.exports = {
    createPaymentRecord, updatePaymentRecord, getPaymentStatusDone, cancelUserPayment
}
