'use-strict'

const moment = require('moment-timezone')
const logger = require('./logger')
moment.tz.setDefault('Asia/Ho_Chi_Minh')

const DATE_FORMAT_1 = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT_2 = 'YYYY/MM/DD HH:mm:ss'

/**
 * getDateTimeCurrent
 * @param {*} format
 * @returns
 */
const getDateTimeCurrent = (format = DATE_FORMAT_1) => {
	return moment().format(format)
}

const formatDateTime = (dateTime) => {
	if (dateTime === null) return null
	if (dateTime === '') return ''
	try {
		return moment(dateTime).format(DATE_FORMAT_1)
	} catch (error) {
		logger.warn(
			`formatDateTime error value: ${dateTime} error: ${error.message}`
		)
		return null
	}
}

const formatDateTimeV1 = (dateTime) => {
	if (dateTime === null) return null
	if (dateTime === '') return ''
	try {
		return moment(dateTime).format(DATE_FORMAT_2)
	} catch (error) {
		logger.warn(
			`formatDateTime error value: ${dateTime} error: ${error.message}`
		)
		return null
	}
}

module.exports = {
	getDateTimeCurrent,
	formatDateTime,
	formatDateTimeV1,
}
