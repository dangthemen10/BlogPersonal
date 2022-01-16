'use-strict'

const getDateTimeCurrent = () => {
	const today = new Date()
	const date = `${today.getFullYear()}-${
		today.getMonth() + 1
	}-${today.getDate()}`
	const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
	return new Date(`${date} ${time}`)
}

const getDateFormat = () => {
	const today = new Date()
	const date = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`
	const time = `${today.getHours()}${today.getMinutes()}${today.getSeconds()}`
	return `${date}${time}`
}

module.exports = {
	getDateTimeCurrent,
	getDateFormat,
}
