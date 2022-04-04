const { body } = require('express-validator')

const validationAuth = () => {
	return [
		body('email')
			.not()
			.isEmpty()
			.withMessage('Email is empty')
			.isString()
			.withMessage('Email is invalid')
			.isEmail()
			.withMessage('Please enter the correct email format'),
		body('password')
			.not()
			.isEmpty()
			.withMessage('Password is invalid')
			.isLength({ min: 6, max: 255 })
			.withMessage('Please enter a Password with a length of 6-255 characters'),
	]
}

module.exports = {
	validationAuth,
}
