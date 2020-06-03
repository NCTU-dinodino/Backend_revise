var express = require('express');
var router = express.Router();

var csrfProtection = require('csurf')();
var getStudentId = require('../../../../user/common/handler/getStudentId').getStudentId.studentId;

var syncProfessionalField = require('./../graduate/syncProfessionalField.js');
var fetchAndParseData = require('./../common/fetchAndParseData.js');
var initContainers = require('./../graduate/initContainers.js');
var mergeDuplicates = require('./../graduate/mergeDuplicates.js');
var classifyCourses = require('./../graduate/classifyCourses.js');
var handleExceptions = require('./../graduate/handleExceptions.js');
var followRemainingRules = require('./../graduate/followRemainingRules.js');
var generateSummary = require('./../graduate/generateSummary.js');
var getGraduateCheck = require('./../graduate/getGraduateCheck.js');
var updateGraduateStudentList = require('./../graduate/updateGraduateStudentList.js');

function echo(req, res, next) {
	console.log(require('util').inspect(req.csca, false, null, true));
	next();
}

router.post('/assistants/graduate/detail',
	csrfProtection,
	getStudentId,
	syncProfessionalField,
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

router.get('/assistants/graduate/check',
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

router.get('/assistants/graduate/studentListUpdate',
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
