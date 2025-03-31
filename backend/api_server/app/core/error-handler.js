const logger = require('./logger/logger')
const errorHandler = (err, req, res, next) => {
    //log error
    logger.debug.info('error stack : ', err.stack)
    res.status(500).send({ status: false, error: 'some interal error has occured, please contact the administrator' })
}

module.exports = errorHandler