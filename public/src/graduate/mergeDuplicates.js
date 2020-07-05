var merge_exceptions = require('./static/additional_condition.js').merge_exceptions;
var same_courses_with_diff_codes = require('./static/additional_condition.js').same_courses_with_diff_codes;

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

	same_courses_with_diff_codes.forEach((group) => {
		var dup_arr = []
		group.forEach((code) => {
			if (req.csca.courses[code]){
				if (dup_arr.length >= 1){
					var dup_course = Object.assign({},req.csca.courses[code]) 
					req.csca.courses[dup_arr[0]].append(dup_course)
					delete req.csca.courses[code]
				}
				else
					dup_arr.push(code)
			}
		});
	});

	next();
}

module.exports = mergeDuplicate;
