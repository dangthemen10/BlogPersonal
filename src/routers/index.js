'use-strict'

const express = require('express')
const router = express.Router()

// home
router.get('/', async (req, res) => {
	res.status(200).json('Blog api')
})

// auth
router.use(require('./auth'))

module.exports = router
