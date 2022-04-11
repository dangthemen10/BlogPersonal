'use-strict'

const userServices = require('../services/user')

/**
 * Get user list
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const getUsers = async (req, res, next) => {
	try {
		const result = await userServices.getUsers()
		return res.status(200).json(result)
	} catch (error) {
		next(error)
	}
}

/**
 * Get user list
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const getAccounts = async (req, res, next) => {
	try {
		const result = await userServices.getAccounts()
		return res.status(200).json(result)
	} catch (error) {
		next(error)
	}
}

/**
 * Change Password
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const changePassword = async (req, res, next) => {
	try {
		const result = await userServices.changePassword(
			req.params.id,
			req.body.oldPass,
			req.body.newPass
		)
		return res.status(200).json(result)
	} catch (error) {
		next(error)
	}
}

/**
 * Update Information User
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const updateInformationUser = async (req, res, next) => {
	try {
		const data = req.body
		const result = await userServices.updateInformationUser(req.params.id, data)
		return res.status(200).json(result)
	} catch (error) {
		next(error)
	}
}

module.exports = {
	getUsers,
	getAccounts,
	changePassword,
	updateInformationUser,
}
