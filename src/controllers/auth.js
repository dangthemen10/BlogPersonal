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
			req.body.userName,
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
		res.cookie('refreshToken', result.generateRefreshToken, {
			httpOnly: true,
			secure: false,
			path: '/',
			samSite: 'strict',
		})
		// eslint-disable-next-line no-unused-vars
		const { generateRefreshToken, ...data } = result
		return res.status(200).json(data)
	} catch (error) {
		next(error)
	}
}

const refreshToken = async (req, res, next) => {
	try {
		const result = await authServices.refreshToken(
			req.user,
			req.cookies.refreshToken
		)
		res.cookie('refreshToken', result.generateNewRefreshToken, {
			httpOnly: true,
			secure: false,
			path: '/',
			samSite: 'strict',
		})
		// eslint-disable-next-line no-unused-vars
		const { generateNewRefreshToken, ...data } = result
		return res.status(200).json(result)
	} catch (error) {
		next(error)
	}
}

module.exports = {
	register,
	login,
	refreshToken,
}
