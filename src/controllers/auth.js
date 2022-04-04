'use-strict'

const authServices = require('../services/auth')

/**
 * Register account
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const register = async (req, res, next) => {
	try {
		const result = await authServices.register(
			req.body.email,
			req.body.password
		)
		return res.status(200).json(result)
	} catch (error) {
		next(error)
	}
}

/**
 * Login
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const login = async (req, res, next) => {
	try {
		const result = await authServices.login(req.body.email, req.body.password)
		return res.status(200).json(result)
	} catch (error) {
		next(error)
	}
}

module.exports = {
	register,
	login,
}
