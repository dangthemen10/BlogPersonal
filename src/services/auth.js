'use-strict'

const Sequelize = require('sequelize')
const db = require('../models')
const sequelize = require('../models').sequelize
const jwt = require('jsonwebtoken')
const Op = Sequelize.Op
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
const register = async (email, userName, password) => {
	const now = dateUtils.getDateTimeCurrent()
	const transaction = await sequelize.transaction()
	if (!email || !password || !userName) {
		throw badRequestException({
			status: 'BAD_REQUEST',
			message: 'Parameter is not exist!',
		})
	}

	const isEmail = await isEmailExist(email)

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
				userName: userName,
				password: hashPassword,
				role: 'MEMBER',
				createdAt: now,
				updatedAt: now,
			},
			{ transaction }
		)
		// create user
		await UserModel.create(
			{
				email: email,
				userName: userName,
				fullName: null,
				birthDay: null,
				address: null,
				phone: null,
				gender: null,
				country: null,
				accountId: account.id,
				createdAt: now,
				updatedAt: now,
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

const login = async (email, pass) => {
	if (!email || !pass) {
		throw badRequestException({
			status: 'BAD_REQUEST',
			message: 'Parameter is not exist!',
		})
	}

	// validation email to get user
	const user = await validationUserEmail(email)

	// verify password
	const checkPassword = await passwordLib.verifyPassword(pass, user.password)

	if (!checkPassword) {
		throw notFoundException({
			status: 'NOT_FOUND',
			message: 'Password is wrong!',
		})
	}

	logger.info('Check password successfully!')
	const payload = {
		id: user.id,
		email: user.email,
		userName: user.userName,
		role: user.role,
	}
	const options = { expiresIn: '1d' }
	const secret = process.env.JWT_SECRET_KEY
	const token = jwt.sign(payload, secret, options)
	// eslint-disable-next-line no-unused-vars
	const { password, ...data } = user.dataValues
	return {
		...data,
		token,
	}
}

module.exports = {
	register,
	login,
}
