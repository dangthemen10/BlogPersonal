'use-strict'

const Sequelize = require('sequelize')
const db = require('../models')
const sequelize = require('../models').sequelize
const Op = Sequelize.Op
const UserModel = db.user
const AccountModel = db.account
const refreshTokenModel = db.refreshToken
const { badRequestException, notFoundException } = require('../lib/exception')
const generateToken = require('../lib/generateToken')
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

/**
 * Login
 *
 * @param {*} email
 * @param {*} pass
 * @returns
 */
const login = async (email, pass) => {
	const now = dateUtils.getDateTimeCurrent()
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
	// access token
	const generateAccessToken = generateToken.generateAccessToken(
		user,
		'30s',
		process.env.JWT_SECRET_KEY
	)
	// refresh token
	const generateRefreshToken = generateToken.generateAccessToken(
		user,
		'7d',
		process.env.JWT_REFRESH_KEY
	)

	const token = await refreshTokenModel.findOne({
		where: {
			email: {
				[Op.eq]: user.email,
			},
		},
	})

	if (token == null) {
		await refreshTokenModel.create({
			email: user.email,
			token: generateRefreshToken,
			createdAt: now,
			updatedAt: now,
		})
	} else {
		await refreshTokenModel.update(
			{
				token: generateRefreshToken,
				updatedAt: now,
			},
			{
				where: {
					id: {
						[Op.eq]: token.id,
					},
				},
			}
		)
	}

	// eslint-disable-next-line no-unused-vars
	const { password, ...data } = user.dataValues
	return {
		...data,
		generateAccessToken,
		generateRefreshToken,
	}
}

const refreshToken = async (user, token) => {
	logger.info('Cookie nè:', token)
	const now = dateUtils.getDateTimeCurrent()

	const result = await refreshTokenModel.findOne({
		where: {
			email: user.email,
		},
	})
	if (result == null) {
		throw notFoundException({
			status: 'NOT_FOUND',
			message: 'Not found user',
		})
	}
	// access token
	const generateNewAccessToken = generateToken.generateAccessToken(
		user,
		'30s',
		process.env.JWT_SECRET_KEY
	)
	// refresh token
	const generateNewRefreshToken = generateToken.generateAccessToken(
		user,
		'7d',
		process.env.JWT_REFRESH_KEY
	)

	await refreshTokenModel.update(
		{
			token: generateNewRefreshToken,
			updatedAt: now,
		},
		{
			where: {
				id: {
					[Op.eq]: result.id,
				},
			},
		}
	)
	return {
		generateNewAccessToken,
		generateNewRefreshToken,
	}
}

module.exports = {
	register,
	login,
	refreshToken,
}
