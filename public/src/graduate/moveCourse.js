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

	if(target_group == '抵免研究所課程'){
		req.csca.classes.pro_elective.calculateCredit();
		if(req.csca.classes.pro_elective.credit <= req.csca.classes.pro_elective.require){
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
