var query = require('../../../../db/msql');

function curriculumAllCourses(req, res, next) {
    if (req.session.profile) {

        var teacherId = res.locals.teacherId;
        query.ShowTeacherCosAll(teacherId, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                for (let i = 0; i < result.length; i++) {
                    let year = result[i].unique_id.substring(0, 3);
                    let sem = result[i].unique_id.substring(4, 5);
                    let id = result[i].unique_id.substring(6, 10);
                    if (sem == 1)
                        result[i].unique_id = year + '上(' + id + ')';
                    else if (sem == 2)
                        result[i].unique_id = year + '下(' + id + ')';
                    else
                        result[i].unique_id = year + '暑期(' + id + ')';
                }
                req.allCourses = result;
                if (req.allCourses)
                    next();
                else
                    return;
            }
        });
    }
    else
        res.redirect('/');

}

function curriculumScoreInterval(req, res, next) {
    if (req.session.profile) {
        var cos_code = req.body.cos_code;
        var unique_id = req.body.unique_id;
        var year = unique_id.substring(0, 3);
        var sem = unique_id.substring(3, 4);
        var id = unique_id.substring(5, 9);

        if (sem == '上')
            unique_id = year + '-1-' + id;
        else if (sem == '下')
            unique_id = year + '-2-' + id;
        else
            unique_id = year + '-3-' + id;

        query.ShowCosScoreInterval(cos_code, unique_id, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                req.scoreInterval = result;
                if (req.scoreInterval)
                    next();
                else
                    return;
            }
        });
    }
    else
        res.redirect('/');
}

function curriculumScoreDetail(req, res, next) {
    if (req.session.profile) {
        var cos_code = req.body.cos_code;
        var unique_id = req.body.unique_id;
        var year = unique_id.substring(0, 3);
        var sem = unique_id.substring(3, 4);
        var id = unique_id.substring(5, 9);
        if (sem == '上')
            unique_id = year + '-1-' + id;
        else if (sem == '下')
            unique_id = year + '-2-' + id;
        else
            unique_id = year + '-3-' + id;

        query.ShowCosScoreDetail(cos_code, unique_id, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                req.scoreDetail = result;
                if (req.scoreDetail)
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
    curriculumAllCourses,
    curriculumScoreInterval,
    curriculumScoreDetail
}
