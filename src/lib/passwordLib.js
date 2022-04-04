'use-strict'

const bcrypt = require('bcrypt')
/**
 * Auto-gen a salt and hash
 * bcrypt is a combination of hashing, salting and catching.
 * The salt is a random string of characters, attached to the password
 * Stretching is a method of complicating the hash value and increasing the computation time for decryption
 *
 * @param {*} myPlaintextPassword
 * @returns myPlaintextPassword hash
 */
const hashPassword = async (myPlaintextPassword) => {
	const saltRounds = 10

	const salt = await bcrypt.genSalt(saltRounds)
	const hash = await bcrypt.hash(myPlaintextPassword, salt)

	return hash
}

/**
 * verify Password
 *
 * @param {*} passwordReq
 * @param {*} passwordDB
 * @returns
 */
const verifyPassword = async (passwordReq, passwordDB) => {
	const verifyPass = await bcrypt.compare(passwordReq, passwordDB)

	if (!verifyPass) {
		return false
	}

	return true
}

module.exports = {
	hashPassword,
	verifyPassword,
}
