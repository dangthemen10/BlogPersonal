'use-strict'

const logger = require('../lib/logger')
const { validationResult } = require('express-validator')
const ERROR_404 = { message: 'Not Found' }
const ERROR_500 = { message: 'Internal Server Error' }

/**
 * Handle validate
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const validateHandle = (req, res, next) => {
	const error = validationResult(req)
	if (!error.isEmpty()) {
		const errFormat = ({ location, msg, param, value, nestedErrors }) => {
			return `${msg}`
		}
		const result = error.formatWith(errFormat).mapped()
		return res.status(400).json({ code: 'BAD_REQUEST', message: result })
	}
	next()
}

/**
 * Not Found Error
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const notFoundError = (req, res, next) => {
	logger.info(`404 method: ${req.method} url: ${req.originalUrl}`)
	return res.status(404).json(ERROR_404)
}

/**
 * Internal Server Error
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const internalServerError = (err, req, res, next) => {
	if (err.status === 400) {
		logger.error(
			`internalServerError error status: ${err.status} method: ${
				req.method
			} url: ${req.originalUrl} param: ${JSON.stringify(req.params)}`
		)
	} else {
		logger.error(
			`internalServerError error status: ${err.status} method: ${req.method} url: ${req.originalUrl} error: ${err.stack}`
		)
	}
	return res.status(err.status || 500).json(err.message || ERROR_500)
}
module.exports = {
	validateHandle,
	notFoundError,
	internalServerError,
}
