'use-strict'

const NOT_FOUND = 404
const BAD_REQUEST = 400
const UNAUTHORIZED = 401
const FORBIDDEN = 403
const exception = (status, message) => {
	const error = {}
	error.status = status
	error.message = message
	return error
}

const notFoundException = (message) => exception(NOT_FOUND, message)

const badRequestException = (message) => exception(BAD_REQUEST, message)

const unauthorizedException = (message) => exception(UNAUTHORIZED, message)

const forbiddenException = (message) => exception(FORBIDDEN, message)

module.exports = {
	exception,
	notFoundException,
	badRequestException,
	unauthorizedException,
	forbiddenException,
}
