var query = require('../db/msql');

/*列出推薦選課列表*/
function recommendCourseList(req, res, next) {
    if (req.session.profile) {
        var studentId = res.locals.studentId;
        query.ShowRecommendCos(studentId, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                req.courseList = result;
                if (req.courseList)
                    next();
                else
                    return;
            }
        });
    }
    else
        res.redirect('/');

}

/*給推薦選課評分*/
function recommendSetStar(req, res, next) {
    if (req.session.profile) {
        var star = {
            student_id: req.body.student_id,
            unique_id: req.body.unique_id,
            star_level: Number(req.body.star_level)
        };
        query.SetRecommendCosStar(star, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            else if (!result) {
                res.redirect('/');
            }
            else {
                result = JSON.parse(result);
                req.setStar = result;
                if (req.setStar)
                    next();
                else
                    return;
            }
        });
    }
    else
        res.redirect('/');

}

/*列出熱門選課列表*/
function recommendCurrent(req, res, next) {
    if (req.session.profile) {
        var studentId = { student_id: res.locals.studentId };
        query.ShowStudentHotCos(studentId, function (err, result) {
            if (err) {
                throw err;
                return;
            }
            if (!result)
                res.redirect('/');
            else {
                var result = JSON.parse(result);
                var list = [];
                for (var i = 0; i < result.length; i++) {
                    var hot_course = {
                        unique_id: '',
                        url: '',
                        cos_credit: '',
                        cos_time: '',
                        depType: '',
                        tname: '',
                        cos_cname: ''
                    };
                    hot_course.unique_id = result[i].unique_id;
                    hot_course.url = result[i].url;
                    hot_course.cos_credit = result[i].cos_credit;
                    hot_course.cos_time = result[i].cos_time;
                    hot_course.depType = result[i].depType;
                    hot_course.tname = result[i].tname;
                    hot_course.cos_cname = result[i].cos_cname;
                    list.push(hot_course);
                }
                req.current = list;
                if (req.current)
                    next();
                else
                    return;
            }
        });
    }
    else
        res.redirect('/');

}

module.exports = {
    recommendCourseList,
    recommendSetStar,
    recommendCurrent
}
