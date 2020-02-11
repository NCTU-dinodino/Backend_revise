var express = require('express');
var router = express.Router();

var csrfProtection = require('csurf')();
var getStudentId = require('../../../../user/common/handler/getStudentId').getStudentId.studentId;

var initContainers = require('./../graduate/initContainers.js');
var fetchData = require('./../graduate/fetchData.js');
var mergeDuplicate = require('./../graduate/mergeDuplicates.js');
var classifyCourses = require('./../graduate/classifyCourses.js');
var handleExceptions = require('./../graduate/handleExceptions.js');
var followRemainingRules = require('./../graduate/followRemainingRules.js');
var generateSummary = require('./../graduate/generateSummary.js');
var determineValidDestination = require('./../graduate/determineValidDestination.js');

function echo(req, res, next){
	console.log(require('util').inspect(req.csca, false, null, true));
	next();
}

router.post('/students/graduate/detail', 
	csrfProtection,
	initContainers,
	getStudentId,
	fetchData,
	mergeDuplicate, 
	classifyCourses, 
	handleExceptions, 
	followRemainingRules,
	generateSummary, 
	(req, res, next) => {
		res.json(req.csca.summary);
	}
);

router.post('/students/graduate/legalMoveTarget',
	csrfProtection,
	initContainers,
	getStudentId,
	fetchData,
	mergeDuplicate,
	determineValidDestination,
	(req, res) => {
		res.json(req.csca.legalTarget);
	}
);

module.exports = router;
