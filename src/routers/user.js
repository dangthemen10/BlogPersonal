'use-strict'

const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const { validateHandle } = require('../middleware/errorHandler')
const { authorizationJWT } = require('../middleware/auth')
const userVaidation = require('../validation/user')

/**
 * get user list
 */
router.get('/users', validateHandle, authorizationJWT, userController.getUsers)

/**
 * Get account list
 */
router.get(
	'/accounts',
	validateHandle,
	authorizationJWT,
	userController.getAccounts
)

/**
 * Change password
 */
router.put(
	'/user/change-password/:id',
	userVaidation.validationChangePassword(),
	validateHandle,
	authorizationJWT,
	userController.changePassword
)

/**
 * Update information user
 */
router.put(
	'/user/update-information/:id',
	validateHandle,
	authorizationJWT,
	userController.updateInformationUser
)

module.exports = router
