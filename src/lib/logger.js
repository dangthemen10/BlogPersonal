'use-strict'

const winston = require('winston')
const date = require('./dateUtils').getDateFormat()

//
// Logging levels
//
const config = {
	levels: {
		error: 0,
		debug: 1,
		warn: 2,
		data: 3,
		info: 4,
		verbose: 5,
		silly: 6,
		custom: 7,
	},
	colors: {
		error: 'red',
		debug: 'blue',
		warn: 'yellow',
		data: 'grey',
		info: 'green',
		verbose: 'cyan',
		silly: 'magenta',
		custom: 'yellow',
	},
}
winston.addColors(config.colors)

const logger = winston.createLogger({
	levels: config.levels,
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		winston.format.simple()
	),
	transports: [
		new winston.transports.File({
			filename: `./log/log_${date}.log`,
			levels: config.levels,
		}),
	],
})

// chỉ ghi log ra console nếu không phải là môi trường production
if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		})
	)
}
module.exports = logger
