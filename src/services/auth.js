'use-strict'

const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require('../models')
const sequelize = require('../models').sequelize
const UserModel = db.user
const AccountModel = db.account
const { badRequestException, notFoundException } = require('../lib/exception')
const dateUtils = require('../lib/dateUtils')
const logger = require('../lib/logger')
const passwordLib = require('../lib/passwordLib')

/**
 * Find User By Email
 *
 * @param {*} email
 * @returns user
 */
const findOneUserByEmail = async (email) => {
	const result = await AccountModel.findOne({
		where: {
			email: {
				[Op.like]: email,
			},
		},
	})
	logger.info(`Result: ${result}`)

	return result
}

/**
 * Validation user email
 *
 * @param {*} email
 * @returns
 */
const validationUserEmail = async (email) => {
	const user = await findOneUserByEmail(email)

	if (user == null) {
		throw notFoundException({
			status: 'NOT_FOUND',
			message: `Cannot find User with email: ${email} !`,
		})
	}
	return user
}

const isEmailExist = async (email) => {
	const result = await findOneUserByEmail(email)

	if (result) {
		return true
	}

	return false
}

/**
 * register account
 * @param {*} email
 * @param {*} password
 * @returns
 */
const register = async (email, password) => {
	const now = dateUtils.getDateTimeCurrent()
	const transaction = await sequelize.transaction()
	if (!email || !password) {
		throw badRequestException({
			status: 'BAD_REQUEST',
			message: 'Parameter is not exist!',
		})
	}

	const isEmail = await isEmailExist(email)
	logger.info(`IsEmail: ${isEmail}`)

	if (isEmail) {
		throw badRequestException({
			status: 'BAD_REQUEST',
			message: `User's email: ${email} already exist`,
		})
	}

	//hash password with bcrypt
	const hashPassword = await passwordLib.hashPassword(password)

	try {
		// create account
		const account = await AccountModel.create(
			{
				email: email,
				password: hashPassword,
				role: false,
				createAt: now,
				updateAt: now,
			},
			{ transaction }
		)
		// create user
		await UserModel.create(
			{
				email: email,
				username: null,
				fullname: null,
				day_of_birth: null,
				address: null,
				phone: null,
				gender: null,
				country: null,
				account_id: account.id,
				createAt: now,
				updateAt: now,
			},
			{ transaction }
		)

		await transaction.commit()
		return 'Successfully'
	} catch (error) {
		logger.warn(`Create account error: ${error}`)
		await transaction.rollback()
		throw error
	}
}

const login = async (email, password) => {
	if (!email || !password) {
		throw badRequestException({
			status: 'BAD_REQUEST',
			message: 'Parameter is not exist!',
		})
	}

	// validation email to get user
	const user = await validationUserEmail(email)

	// verify password
	const checkPassword = await passwordLib.verifyPassword(
		password,
		user.password
	)

	if (!checkPassword) {
		throw notFoundException({
			status: 'NOT_FOUND',
			message: 'Password is wrong!',
		})
	}

	logger.info('Check password successfully!')
	return user
}

module.exports = {
	register,
	login,
}
