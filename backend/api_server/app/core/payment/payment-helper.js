
const httpStatus = require('http-status-codes')
const logger = require('../logger/logger')
const Razorpay = require('razorpay')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

const { createPaymentRecord, updatePaymentRecord, getPaymentStatusDone, cancelUserPayment } = require('./payment-db-helper')
const { INTERNAL_SERVER_ERROR } = require('../../common/common-constants')
const { readUserById } = require('../../core/user/user-db-helper')

async function createOrder(input) {
    logger.debug.debug('in payment-helper loginUser by userId=' + input.userId)
    try {
        const razorpay = new Razorpay({
            key_id: `${process.env.RAZORPAY_KEY_ID}`,
            key_secret: `${process.env.RAZORPAY_KEY_SECRET}`,
        });
        const receiptNumber = generateOrderNumber();
        // setting up options for razorpay order.
        const options = {
            //amount: input.amount * 100, // Amount in paise (multiply by 100)
            amount: 299 * 100,
            //amount: 10 * 100,
            currency: 'INR',
            receipt: receiptNumber,
            payment_capture: 1
        };
        const response = await razorpay.orders.create(options)
        const data = {
            orderId: response.id,
            currency: response.currency,
            amount: response.amount,
        }
        // add entry in DB
        const recordData = { userId: input.userId, receiptNumber };
        Object.assign(recordData, data);
        const createResult = await createPaymentRecord(recordData);
        logger.debug.debug('in payment-helper record created by userId=' + input.userId)
        const result = { statusCode: httpStatus.OK, data: { success: true, message: 'Order Created', data: data } }
        return result
    } catch (error) {
        logger.debug.debug('in payment-helper createOrder server error by userId=' + input.userId + ', error=' + error.stack)
        const result = { statusCode: httpStatus.BAD_REQUEST, data: { success: false, message: 'Not able to create order. Please try again!' } }
        return result
    }

}

async function recordOrder(input) {
    logger.debug.debug('in payment-helper recordOrder by userId=' + input.userId)
    try {
        const razorpayOrderId = input.razorpay_order_id;
        const razorpayPaymentId = input.razorpay_payment_id;
        const razorpaySignature = input.razorpay_signature;
        const userId = input.userId
        // save in DB
        const paymentStatus = 'Done';
        const saveResult = await updatePaymentRecord({ userId, razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentStatus });
        logger.debug.debug('in payment-helper record updated by userId=' + input.userId)
        const token = jwt.sign({ user: { userId, paymentStatus } }, process.env.API_SECRET, { expiresIn: '24h' })
        const result = { statusCode: httpStatus.OK, data: { success: true, message: 'Transaction recored saved', token } }
        // send welcome email
        sendWelcomeEmail(userId);
        return result
    } catch (error) {
        logger.debug.debug('in payment-helper recordOrder server error by userId=' + input.userId + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }
}

async function checkPaymentStatus(input) {
    logger.debug.debug('in payment-helper checkPaymentStatus by userId=' + input.userId)
    try {
        let paymentStatus = 'NOT_DONE';
        bypassPayment = process.env.BYPASS_PAYMENT
        if (bypassPayment == 'true') {
            paymentStatus = 'Done';
            const result = { statusCode: httpStatus.OK, data: { success: true, message: 'Payment status fetched', paymentStatus } }
            return result
        }
        const userId = input.userId
        const paymentResult = await getPaymentStatusDone({ userId });
        logger.debug.debug('in payment-helper checkPaymentStatus after getting status by userId=' + input.userId)

        if (paymentResult.rowCount > 0) {
            paymentStatus = 'Done';
        }
        const result = { statusCode: httpStatus.OK, data: { success: true, message: 'Payment status fetched', paymentStatus } }
        return result
    } catch (error) {
        logger.debug.debug('in payment-helper checkPaymentStatus server error by userId=' + input.userId + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }
}

async function cancelPayment(input) {
    logger.debug.debug('in payment-helper cancelPayment by userId=' + input.userId)
    try {
        const userId = input.userId
        const paymentResult = await cancelUserPayment({ userId, orderId: input.orderId });
        logger.debug.debug('in payment-helper cancelPayment after cancelling payment by userId=' + input.userId)

        const result = { statusCode: httpStatus.OK, data: { success: true, message: 'Payment cancelled' } }
        return result
    } catch (error) {
        logger.debug.debug('in payment-helper cancelPayment server error by userId=' + input.userId + ', error=' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }
}


function generateOrderNumber() {
    // Generate a timestamp (number of milliseconds since Unix epoch)
    const timestamp = Date.now();
    // Generate a random number (between 1000 and 9999)
    const random = Math.floor(Math.random() * 9000) + 1000;
    // Concatenate timestamp and random number to form the order number
    const orderNumber = `${timestamp}${random}`;
    return orderNumber;
}

async function sendWelcomeEmail(userId) {
    const result = await readUserById(userId);
    const email = result.rows[0].username;

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
        subject: 'Congratulations on Taking an Important Step for Your Child’s Future!',
        html: '<b>Dear Parent</b>,<br>Congratulations on purchasing the ByTrait Career Guidance Tool! You’ve taken a significant step in guiding your child toward a successful and fulfilling future. We’re excited to help you on this journey. Here’s a step-by-step guide to making the most of ByTrait:<br><br><b>1. Allow your child to take the personality and career interest test.</b>This test will provide insights into their strengths and preferences.<br><br><b>2. Select any two areas of their interest, such as engineering, healthcare, etc.</b><br>Choosing areas they’re passionate about will ensure the guidance is tailored to their aspirations. Use "Other" to select the area that is not listed.<br><br><b>3. Take time to discuss the report in detail with your child.</b><br>This conversation is crucial for understanding their perspective and aspirations.<br><br><b>4. The report includes:</b><ul><li><b>Personality strengths of your child:</b> Understand their unique traits.</li><li><b>Career interests:</b> Align their strengths with their passions.</li><li><b>Six career options</b>: These are the best suitable for your child considering their strengths, career interests, and the fields they are interested in working in.</li></ul><b>5. Each career option comes with a detailed career path in eight steps:</b><br>From understanding the career option to becoming a successful professional, each step is clearly outlined.<br><br><b>6. Review the report carefully and explain it to your child.</b><br>Ensure they understand each aspect, making it a collaborative process.<br><br><b>7. Engage in a discussion with your child about their views.</b><br>This will help make the career decision a mutual and well-informed one.<br><br>To further assist you, here’s the link to download our free eBook, <b>“Empowering Your Child’s Future: A Parent’s Guide to Career Mentoring.”</b><br><br><a rel="noreferrer" href="https://drive.google.com/file/d/1yWdJkupmauG7qcPqJIeQITKFOWp68QJu/view?usp=sharing" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://drive.google.com/file/d/1yWdJkupmauG7qcPqJIeQITKFOWp68QJu/view?usp%3Dsharing&amp;source=gmail&amp;ust=1721712612841000&amp;usg=AOvVaw2GFsUA7V1628sjh2GTI1sB">Download eBook</a><br><br>Thank you for choosing ByTrait. We wish you and your child the very best on this exciting journey!<br><br><b>Good luck,</b><br><br>The ByTrait Team',
    }
    mailTransporter.sendMail(mailOptions, function (err, data) {

        if (err) {
            console.log('Error in sending email ' + err)
        } else {
            console.log('Email sent successfully')
        }
    });

}


module.exports = {
    createOrder, recordOrder, checkPaymentStatus, cancelPayment
}