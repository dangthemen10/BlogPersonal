'use-strict'

const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const { validateHandle } = require('../middleware/errorHandler')
const { verifyAdministrator, verifyToken } = require('../middleware/auth')
const userVaidation = require('../validation/user')

/**
 * get user list
 */
router.get(
	'/users',
	validateHandle,
	verifyAdministrator,
	userController.getUsers
)

/**
 * Get account list
 */
router.get(
	'/accounts',
	validateHandle,
	verifyAdministrator,
	userController.getAccounts
)

/**
 * Change password
 */
router.put(
	'/user/change-password/:id',
	userVaidation.validationChangePassword(),
	validateHandle,
	verifyToken,
	userController.changePassword
)

/**
 * Update information user
 */
router.put(
	'/user/update-information/:id',
	validateHandle,
	verifyToken,
	userController.updateInformationUser
)

module.exports = router
