'use-strict'

require('dotenv').config()
const jwt = require('jsonwebtoken')
const {
	forbiddenException,
	unauthorizedException,
} = require('../lib/exception')
const logger = require('../lib/logger')

/**
 * Verify makes sure that the token hasn't expired and has been issued
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const authorizationJWT = (req, res, next) => {
	const authorizationHeader = req.headers.authorization
	let result
	if (authorizationHeader) {
		const token = authorizationHeader.split(' ')[1] // Bearer <token>
		const options = {
			expiresIn: '1d',
		}
		try {
			result = jwt.verify(token, process.env.JWT_SECRET_KEY, options)
			req.user = result
			next()
		} catch (err) {
			logger.warn(`middleware::auth::authorizationJWT Error ${err}`)
			throw forbiddenException({
				status: 'FORBIDDEN',
				message: 'Token is invalid',
			})
		}
	} else {
		throw unauthorizedException({
			status: 'UNAUTHORIZED',
			message: 'Authentication error. Token required.',
		})
	}
}
/**
 * Verify Administrator
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const verifyAdministrator = (req, res, next) => {
	authorizationJWT(req, res, () => {
		if (req.user.role === 'ADMIN') {
			next()
		} else {
			res.status(403).json('Not permission')
		}
	})
}

/**
 * Verify Token
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const verifyToken = (req, res, next) => {
	authorizationJWT(req, res, () => {
		if (req.user.id == req.params.id) {
			next()
		} else {
			res.status(403).json('Not permission')
		}
	})
}

module.exports = {
	authorizationJWT,
	verifyAdministrator,
	verifyToken,
}
