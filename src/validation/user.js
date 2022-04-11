const { body } = require('express-validator')

const validationChangePassword = () => {
	return [
		body('oldPass')
			.not()
			.isEmpty()
			.withMessage('Password is invalid')
			.isLength({ min: 6, max: 255 })
			.withMessage('Please enter a Password with a length of 6-255 characters'),
		body('newPass')
			.not()
			.isEmpty()
			.withMessage('Password is invalid')
			.isLength({ min: 6, max: 255 })
			.withMessage('Please enter a Password with a length of 6-255 characters'),
	]
}

module.exports = {
	validationChangePassword,
}
