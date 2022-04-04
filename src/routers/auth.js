'use-strict'

const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { validateHandle } = require('../middleware/errorHandler')
const authVaidation = require('../validation/auth')

/**
 * register account
 */
router.post(
	'/auth/register',
	authVaidation.validationAuth(),
	validateHandle,
	authController.register
)

/**
 * register account
 */
router.post(
	'/auth/login',
	authVaidation.validationAuth(),
	validateHandle,
	authController.login
)

module.exports = router
