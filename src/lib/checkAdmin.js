'use-strict'
const hasRole = (role) => {
	return role.map((element) => element.toUpperCase()).includes('ADMIN')
}

module.exports = {
	hasRole,
}
