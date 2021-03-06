'use-strict'

const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { validateHandle } = require('../middleware/errorHandler')
// const { refreshToken } = require('../middleware/auth')s
const authVaidation = require('../validation/auth')

/**
 * register account
 */
router.post(
	'/auth/register',
	authVaidation.validationRegister(),
	validateHandle,
	authController.register
)

/**
 * register account
 */
router.post(
	'/auth/login',
	authVaidation.validationLogin(),
	validateHandle,
	authController.login
)

router.post(
	'/auth/refresh-token',
	// authVaidation.validationRefreshToken(),
	validateHandle,
	// refreshToken,
	authController.refreshToken
)

module.exports = router
