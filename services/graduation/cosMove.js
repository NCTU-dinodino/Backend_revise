var query = require('../../db/msql');

function graduateResetMove(req, res, next) {
    if (req.session.profile) {
        var input = req.body.student_id;
        query.DeleteCosMotion(input);
        req.signal = { signal: 1 };
        if (req.signal)
            next();
        else
            return;
    }
    else
        res.redirect('/');
}

/* 畢業預審移動課程 */
function graduateMoveCourse(req, res, next) {
    if (req.session.profile) {
        var id = req.body.student_id;
        var cos_name = req.body.cn;
        var origin_group = req.body.origin_group;
        var target_group = req.body.target_group;
        //console.log(target_group);
        query.ShowStudentGraduate({ student_id: id }, function (err, result) {
            if (err)
                throw err;
            result = JSON.parse(result);
            if (result[0].pro > 0 && target_group == '抵免研究所課程') {
                req.moveCourse = {
                    success: false,
                    reason: '超過畢業學分才可移動'
                }
                if (req.moveCourse)
                    next();
            }
        });
        setTimeout(function () {
            query.SetCosMotion(id, cos_name, origin_group, target_group, function (err, result) {
                if (err) {
                    throw err;
                    res.redirect('/');
                }
                if (!result)
                    res.redirect('/');
                else {
                    result = JSON.parse(result);
                    req.moveCourse = {
                        success: true,
                        reason: ''
                    }
                    if (parseInt(result.info.affectedRows) == 0) {
                        req.moveCourse.success = false;
                        req.moveCourse.reason = 'error';
                    }
                    if (req.moveCourse)
                        next();
                    else
                        return;
                }
            });
        }, 1000);
    }
    else
        res.redirect('/');
}

module.exports = {
    graduateResetMove,
    graduateMoveCourse
}