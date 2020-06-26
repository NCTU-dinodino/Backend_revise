var express = require('express');
var router = express.Router();

var csrfProtection = require('csurf')();
var getStudentId = require('../../middleware/getStudentId').getStudentId.studentId;

var syncProfessionalField = require('../../services/graduation/syncProfessionalField.js');
var fetchAndParseData = require('../../services/graduation/common/fetchAndParseData.js');
var initContainers = require('../../services/graduation/initContainers.js');
var mergeDuplicates = require('../../services/graduation/mergeDuplicates.js');
var classifyCourses = require('../../services/graduation/classifyCourses.js');
var handleExceptions = require('../../services/graduation/handleExceptions.js');
var followRemainingRules = require('../../services/graduation/followRemainingRules.js');
var generateSummary = require('../../services/graduation/generateSummary.js');
var determineValidDestination = require('../../services/graduation/determineValidDestination.js');
var getGraduateCheck = require('../../services/graduation/getGraduateCheck.js');
var getGraduateEnglish = require('../../services/graduation/getGraduateEnglish')
var cosMove = require('../../services/graduation/cosMove')

function echo(req, res, next){
	console.log(require('util').inspect(req.csca, false, null, true));
	next();
}

// prefix of API: /_api/students/graduation
router.post('/detail', 
	csrfProtection,
	syncProfessionalField,
	getStudentId,
	(req, res, next) => {
		req.csca.query_list = [
			{func_name: 'ShowUserAllScore', 	container_name: 'user_all_score',	syntax: req.csca.student_id},
			{func_name: 'ShowUserOnCos',		container_name:	'user_on_cos',		syntax: req.csca.student_id},
			{func_name: 'ShowUserOffset',		container_name:	'user_offset',		syntax: req.csca.student_id},
			{func_name: 'ShowCosMotionLocate',	container_name:	'cos_motion_locate',	syntax: req.csca.student_id},
			{func_name: 'ShowCosGroup',		container_name: 'cos_group',		syntax: req.csca.student_id},
			{func_name: 'ShowGraduateRule',		container_name: 'graduate_rule',	syntax: req.csca.student_id},
			{func_name: 'ShowUserInfo',		container_name: 'user_info',		syntax: req.csca.student_id}
		];
		next();
	},
	fetchAndParseData,
	initContainers,
	mergeDuplicates, 
	classifyCourses, 
	handleExceptions, 
	followRemainingRules,
	generateSummary, 
	(req, res, next) => {
		res.json(req.csca.summary);
	}
);

router.post('/legalMoveTarget',
	csrfProtection,
	getStudentId,
	(req, res, next) => {
		req.csca.query_list = [
			{func_name: 'ShowUserAllScore', 	container_name: 'user_all_score',	syntax: req.csca.student_id},
			{func_name: 'ShowUserOnCos',		container_name:	'user_on_cos',		syntax: req.csca.student_id},
			{func_name: 'ShowCosGroup',		container_name: 'cos_group',		syntax: req.csca.student_id},
			{func_name: 'ShowGraduateRule',		container_name: 'graduate_rule',	syntax: req.csca.student_id}
		];
		next();
	},
	fetchAndParseData,
	initContainers,
	mergeDuplicates,
	determineValidDestination,
	(req, res) => {
		res.json(req.csca.legal_target);
	}
);

router.get('/check',
	getStudentId,
	(req, res, next) => {
		req.csca.query_list = [
			{func_name: 'ShowUserInfo',		container_name: 'user_info',		syntax: req.csca.student_id},
			{func_name: 'ShowStudentGraduate',	container_name: 'student_graduate',	syntax: {student_id: req.csca.student_id}}
		];
		next();
	},
	fetchAndParseData,
	getGraduateCheck,
	(req, res) => {
		res.json(req.csca.check_state);
	}
);


router.get('/english', getStudentId, getGraduateEnglish, function (req, res) {
	res.send(req.english);
});


router.post('/resetMove', csrfProtection, cosMove.graduateResetMove, function (req, res) {
	if (req.signal.signal == 1)
		res.status(204).end();
	else
		res.status(403).end();
	//res.send(req.signal);
});

router.post('/moveCourse', csrfProtection, cosMove.graduateMoveCourse, function (req, res) {
	res.send(req.moveCourse);
});

// TODO: sumary_list

module.exports = router;
