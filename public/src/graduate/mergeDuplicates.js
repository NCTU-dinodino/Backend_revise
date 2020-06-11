var merge_exceptions = require('./static/additional_condition.js').merge_exceptions;

function mergeDuplicate(req, res, next) {
	req.csca.data.taken_courses.forEach((course) => {
		if (merge_exceptions.some(code => course.code == code)){
			let i = 1;
			while(req.csca.courses[course.code + '_' + i]) i++;
			req.csca.courses[course.code + '_' + i] = course;
		} else if (req.csca.courses[course.code]) req.csca.courses[course.code].append(course);
		else req.csca.courses[course.code] = course;
	});
	req.csca.data.on_courses.forEach((course) => {
		if (req.csca.courses[course.code]) req.csca.courses[course.code].append(course);
		else req.csca.courses[course.code] = course;
	});

	next();
}

module.exports = mergeDuplicate;
