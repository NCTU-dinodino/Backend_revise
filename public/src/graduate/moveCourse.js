var query = require('./../../../../../db/msql');

function moveCourse(req, res, next) {
	req.csca.moveCourse = {
		success: true,
		reason: ''
	};

	var id = req.body.student_id;
	var cos_name = req.body.cn;
	var origin_group = req.body.origin_group;
	var target_group = req.body.target_group;
	var pro_elective_credits = 0

	if(target_group == '抵免研究所課程'){
		req.csca.classes.pro_elective.courses.forEach((course) => {
			var cos_data = course.getRepresentingData();
			if(cos_data.cname != cos_name){
				if(cos_data.reason == 'now'){
					if(cos_data.cname.includes("物理")){
						pro_elective_credits += 1;
					}
					else{
						pro_elective_credits += course.original_credit;
					}
				}
				else{
					pro_elective_credits += course.real_credit;
				}
			}
		});
		req.csca.classes.pro_elective.calculateCredit();
		if(pro_elective_credits < req.csca.classes.pro_elective.require){
			req.csca.moveCourse.success = false;
			req.csca.moveCourse.reason = '超過畢業學分才可移動';
			return next();
		}
	}

	query.SetCosMotion(id, cos_name, origin_group, target_group,function(err, result){
		if(err || !result){
			next(err);
		}
		else{
			result = JSON.parse(result);
			if(parseInt(result.info.affectedRows) == 0){
				req.csca.moveCourse.success = false;
				req.csca.moveCourse.reason = 'error';
			}
			next()
		}
	});
}

module.exports = moveCourse;
