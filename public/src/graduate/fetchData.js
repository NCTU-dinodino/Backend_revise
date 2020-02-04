var Course = require('./Container/Course.js');
var CourseRule = require('./Container/CourseRule.js');

var async_flow = require('asynchronous-flow');
var query = require('./../../../query.js');

function fetchData(req, res, next){
	let funcs = [
		fetchTakenCourses,
		fetchOnCourses,
		fetchOffsetCourses,
		fetchMovedRecords,
		fetchCompulsoryList,
		fetchRequiredCredit,

		completeClassDetails,
	];

	let flow = new async_flow();
	flow.setArgs(req)
		.setErrorHandler((err) => {console.log('Error : ', err)})
		.flow(...funcs, (arg) => {
			next();
		});
}

function fetchTakenCourses(req, next){
	query.ShowUserAllScore(req.csca.student_id, (result, err) => {
		if(err)next(err);
		let courses = JSON.parse(result);
		courses.forEach((course) => {
			req.csca.data.taken_courses.push(new Course(course));
		});
		next();
	});
}

function fetchOnCourses(req, next){
	query.ShowUserOnCos(req.csca.student_id, (result, err) => {
		if(err)next(err);
		let courses = JSON.parse(result);
		courses.forEach((course) => {
			req.csca.data.on_courses.push(new Course(course));
		});
		next();
	});
}

function fetchOffsetCourses(req, next){
	query.ShowUserOffset(req.csca.student_id, (result, err) => {
		if(err)next(err);
		let offsets = JSON.parse(result);
		req.csca.data.offset_courses = offsets;
		next();
	});
}

function fetchMovedRecords(req, next){
	query.ShowCosMotionLocate(req.csca.student_id, (result, err) => {
		if(err)next(err);
		let records = JSON.parse(result);
		req.csca.data.moved_records = records;
		next();
	});
}

function fetchCompulsoryList(req, next){
	query.ShowCosGroup(req.csca.student_id, (result, err) => {
		if(err)next(err);
		let rules = JSON.parse(result);
		req.csca.data.compulsory_rules = rules;
		rules.forEach((rule) => {
			req.csca.rules.compulsory.course_rules.push(new CourseRule(rule));
			req.csca.rules.compulsory.codes.push(...rule.cos_codes);
		});
		next();
	});
}

function fetchRequiredCredit(req, next){
	query.ShowGraduateRule(req.csca.student_id, (result, err) => {
		if(err)next(err);
		let credit_nums = JSON.parse(result)[0];
		req.csca.data.required_credit = {
			compulsory:	credit_nums.require_credit,
			pro_elective:	credit_nums.pro_credit,
			elective:	credit_nums.free_credit,
			language:	credit_nums.foreign_credit
		};
		next();
	});
}

function completeClassDetails(req, next){
	req.csca.classes.compulsory.require = parseFloat(req.csca.data.required_credit.compulsory);
	req.csca.classes.pro_elective.require = parseFloat(req.csca.data.required_credit.pro_elective);
	req.csca.classes.elective.require = parseFloat(req.csca.data.required_credit.elective);
	req.csca.classes.language.require = parseFloat(req.csca.data.required_credit.language);

	req.csca.classes.general_old.require = 20;
	req.csca.classes.general_new.require = {
		total:	22,
		core:	6,
		basic:	6,
		cross:	6
	};
	req.csca.classes.PE.require = 6;
	req.csca.classes.service.require = 2;
	req.csca.classes.art.require = 2;
	
	next();
}

module.exports = fetchData;
