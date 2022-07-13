'use-strict'

const jwt = require('jsonwebtoken')

const generateAccessToken = (user, expries, secretKey) => {
	const payload = {
		id: user.id,
		email: user.email,
		userName: user.userName,
		role: user.role,
	}
	const options = { expiresIn: expries }
	const secret = secretKey
	const token = jwt.sign(payload, secret, options)
	return token
}

module.exports = {
	generateAccessToken,
}
