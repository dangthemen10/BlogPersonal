'use-strict'

const Sequelize = require('sequelize')
const db = require('../models')
const Op = Sequelize.Op
const UserModel = db.user
const AccountModel = db.account
const { notFoundException } = require('../lib/exception')
const dateUtils = require('../lib/dateUtils')
const logger = require('../lib/logger')
const passwordLib = require('../lib/passwordLib')

/**
 * Find User By Id
 *
 * @param {*} accountId
 * @returns user
 */
const findOneUserById = async (accountId) => {
	const result = await AccountModel.findOne({
		where: {
			id: {
				[Op.eq]: accountId,
			},
		},
	})
	logger.info(`Result: ${result}`)

	return result
}

/**
 * Get User By Id
 *
 * @param {*} userId
 * @returns
 */
const getOneUserById = async (userId) => {
	const result = await UserModel.findOne({
		where: {
			id: {
				[Op.eq]: userId,
			},
		},
	})

	if (result == null) {
		throw notFoundException({
			status: 'NOT_FOUND',
			message: 'User is invalid',
		})
	}

	return result
}

/**
 * get account list
 *
 * @returns account list
 */
const getAccounts = async () => {
	const accounts = await AccountModel.findAll({
		attributes: {
			exclude: ['password'],
		},
	})
	return accounts
}

/**
 * Get user list
 *
 * @returns user list
 */
const getUsers = async () => {
	const users = await UserModel.findAll()
	return users
}

/**
 * Change password
 *
 * @param {*} email
 * @param {*} oldPass
 * @param {*} newPass
 * @returns
 */
const changePassword = async (accountId, oldPass, newPass) => {
	const now = dateUtils.getDateTimeCurrent()

	// find user want to change password through id
	const user = await findOneUserById(accountId)

	if (user === null) {
		throw notFoundException({
			status: 'NOT_FOUND',
			message: `Account is invalid: ${accountId}!`,
		})
	}

	// verify password
	const checkPassword = await passwordLib.verifyPassword(oldPass, user.password)

	if (!checkPassword) {
		throw notFoundException({
			status: 'NOT_FOUND',
			message: 'Password is wrong!',
		})
	}

	//hash password with bcrypt
	const hashPassword = await passwordLib.hashPassword(newPass)

	// update new password into DB
	await AccountModel.update(
		{
			password: hashPassword,
			updatedAt: now,
		},
		{
			where: {
				id: {
					[Op.eq]: accountId,
				},
			},
		}
	)

	return 'OK'
}

/**
 * Update Information User
 *
 * @param {*} accountId
 * @param {*} data
 * @returns
 */
const updateInformationUser = async (accountId, data) => {
	const now = dateUtils.getDateTimeCurrent()

	// find user want to change password through id
	const account = await findOneUserById(accountId)

	const user = await UserModel.findOne({
		where: {
			account_id: {
				[Op.eq]: account.id,
			},
		},
	})

	if (user === null) {
		throw notFoundException({
			status: 'NOT_FOUND',
			message: `User is invalid: ${accountId}!`,
		})
	}

	await UserModel.update(
		{
			username: data.username,
			fullname: data.fullname,
			day_of_birth: data.birth,
			address: data.address,
			phone: data.phone,
			gender: data.gender,
			country: data.country,
			updatedAt: now,
		},
		{
			where: {
				account_id: {
					[Op.eq]: account.id,
				},
			},
		}
	)

	return getOneUserById(user.id)
}

module.exports = {
	getAccounts,
	getUsers,
	changePassword,
	updateInformationUser,
}
