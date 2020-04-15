var express = require('express')
var routes = express.Router()
var students = require('./students')
var assistants = require('./assistants')
var professors = require('./professors')
var common = require('./common')

routes.use('/students', students)
routes.use('/assistants', assistants)
routes.use('/professors', professors)
routes.use('/common', common)

module.exports = routes
