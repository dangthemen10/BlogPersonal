'use-strict'

const NOT_FOUND = 404
const BAD_REQUEST = 400
const UNAUTHORIZED = 401
const exception = (code, detail) => {
	const error = {}
	error.code = code
	error.detail = detail
	return error
}

const notFoundException = (detail) => exception(NOT_FOUND, detail)

const badRequestException = (detail) => exception(BAD_REQUEST, detail)

const unauthorizedException = (detail) => exception(UNAUTHORIZED, detail)

module.exports = {
	exception,
	notFoundException,
	badRequestException,
	unauthorizedException,
}
