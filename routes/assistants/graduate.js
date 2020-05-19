var express = require('express');
var router = express.Router();

var csrfProtection = require('csurf')();
var getStudentId = require('../../middleware/getStudentId').getStudentId.studentId;

var syncProfessionalField = require('../../services/graduate/syncProfessionalField.js');
var fetchAndParseData = require('../../services/common/fetchAndParseData.js');
var initContainers = require('../../services/graduate/initContainers.js');
var mergeDuplicates = require('../../services/graduate/mergeDuplicates.js');
var classifyCourses = require('../../services/graduate/classifyCourses.js');
var handleExceptions = require('../../services/graduate/handleExceptions.js');
var followRemainingRules = require('../../services/graduate/followRemainingRules.js');
var generateSummary = require('../../services/graduate/generateSummary.js');
var getGraduateCheck = require('../../services/graduate/getGraduateCheck.js');
var updateGraduateStudentList = require('../../services/graduate/updateGraduateStudentList.js');

function echo(req, res, next){
	console.log(require('util').inspect(req.csca, false, null, true));
	next();
}

// prefix of this api: /_api/assistants/graduate
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

router.get('/studentListUpdate',
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
	updateGraduateStudentList,
	(req, res) => {
		res.json(req.csca.student_list);
	}
);

module.exports = router;
