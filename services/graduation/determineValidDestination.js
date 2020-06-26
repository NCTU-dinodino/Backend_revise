var CS_codes_prefix = require('./static/additional_condition.js').CS_course_codes_prefix;
var EE_codes = require('./static/additional_condition.js').EE_course_codes;
var graduate_codes_prefix = require('./static/additional_condition.js').graduate_codes_prefix;

function determineValidDestination(req, res, next) {
	const course = {
		cname: req.body.cn,
		code: req.body.code,
		type: req.body.type
	};

	determineValidDestinationInParallel(req, course)
		.then((destinations) => {
			destinations = destinations.reduce((acc, val) => val.length ? acc.concat(val) : acc);
			req.csca.legal_target = destinations;

			next();
		});
}

async function determineValidDestinationInParallel(req, course) {
	const funcs = [
		validateProElective,
		validateElective,
		validateLanguage,
		validateGeneral,
		validatePE,
		validateService,
		validateArt,
		validateGraduate,
		validateAddition
	];

	const promise_list = [];
	funcs.forEach((func) => {
		promise_list.push(new Promise((resolve) => {
			resolve(func(req, course));
		}));
	});

	return await Promise.all(promise_list);
}

function validateProElective(req, course) {
	let destination = null;

	if (req.csca.rules.compulsory.codes.some((code) => (course.code.startsWith(code)))) {
		if (course.code.endsWith('_one')) destination = ['專業選修'];
		else destination = [];
	} else if (EE_codes.some((code) => course.code == code)) {
		destination = ['專業選修'];
	} else if (CS_codes_prefix.some((code_prefix) => (course.code.startsWith(code_prefix)))) {
		const invalid_course_name = [
			'服務學習(一)',
			'服務學習(二)',
			'導師時間',
			'教學實務',
			'個別研究'
		];
		if (invalid_course_name.some((cname) => (cname == course.cname))) destination = [];
		else destination = ['專業選修'];

		if (course.code == 'IOC5189' && req.csca.student_id.startsWith('08')) destination = [];
	} else destination = [];

	return destination;
}

function validateElective(req, course) {
	let destination = null;

	if (req.csca.rules.compulsory.codes.some((code) => (code + '_one' == course.code))) destination = ['其他選修'];
	else if (req.csca.rules.compulsory.codes.some((code) => (code == course.code))) destination = [];
	else destination = ['其他選修'];

	if (course.type == '軍訓' || course.code.startsWith('PYY') || course.cname == '藝文賞析教育' || course.code.startsWith('GEC') || course.code.startsWith('CGE') || course.code.startsWith('MIN') || course.cname.includes('服務學習')) destination = [];

	if (course.code.startsWith('MIN') && req.csca.student_id.substring(0, 2) != '05') destination = ['其他選修'];

	return destination;
}

function validateLanguage(req, course) {
	let destination = null;
	if (course.type == '外語') destination = ['外語'];
	else destination = [];

	return destination;
}

function validateGeneral(req, course) {
	let destination = null;
	if (course.type != '通識') return [];

	const course_data = Object.values(req.csca.courses).find((single_course_data) => (course.code == single_course_data.code));
	if (req.csca.rules.compulsory.codes.some((code) => (course.code == code)) && CS_codes_prefix.some((prefix) => (course.code.startsWith(prefix)))) destination = [];
	else if (course_data.brief) destination = ['通識'];
	else if (course.code.startsWith('MIN') && course.type == '選修') destination = ['通識'];
	else destination = [];

	return destination;
}

function validatePE(req, course) {
	let destination = null;
	if (course.code.startsWith('PYY')) destination = ['體育'];
	else destination = [];
	return destination;
}

function validateService(req, course) {
	/*let destination = null;
	//if (course.type == '服務學習' || course.type == '通識服務學習') destination = ['服務學習'];
	if (course.type == '通識') destination = [];
	else if (course.cname.includes('服務學習')) destination = ['服務學習'];
	else destination = [];
	return destination;*/
	return [];
}

function validateArt(req, course) {
	let destination = null;
	if (course.cname == '藝文賞析教育') destination = ['藝文賞析'];
	else destination = [];
	return destination;
}

function validateGraduate(req, course) {
	let destination = null;
	if (graduate_codes_prefix.some((code_prefix) => (course.code.startsWith(code_prefix))) || course.type == '大學部修研究所課程') destination = ['抵免研究所課程'];
	else destination = [];
	return destination;
}

function validateAddition(req, course) {
	let destination = null;
	// if (req.csca.rules.compulsory.codes.some((code) => (code == course.code)) && CS_codes_prefix.some((prefix) => (course.code.startsWith(prefix)))) destination = [];
	if (['物理', '化學', '生物'].some((target_name) => (course.cname.includes(target_name)))) destination = ['雙主修、輔系、學分學程'];
	else if (course.type == '必修') destination = [];
	else if (course.code.startsWith('PYY')) destination = [];
	else if (course.type == '服務學習' || course.type == '通識服務學習') destination = [];
	else if (course.cname == '藝文賞析教育') destination = [];
	else if (course.type == '其他不列入畢業學分') destination = [];
	else destination = ['雙主修、輔系、學分學程'];
	return destination;
}

module.exports = determineValidDestination;
