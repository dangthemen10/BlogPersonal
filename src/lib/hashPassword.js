'use-strict'

const hashBcrypt = require('bcrypt')
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

	const salt = await hashBcrypt.genSalt(saltRounds)
	const hash = await hashBcrypt.hash(myPlaintextPassword, salt)

	return hash
}

module.exports = {
	hashPassword,
}
