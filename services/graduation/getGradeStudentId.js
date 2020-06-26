var query = require('../../db/msql')

function getGradeStudentId(req, res, next) {
    var grades = { grade: req.body.grade };
    if (req.session.profile) {
        query.ShowGivenGradeStudentID(grades, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            } else if (!result) {
                res.redirect('/');
            } else {
                var all_result = JSON.parse(result);
                req.studentId = all_result;
                if (req.studentId)
                    next();
                else
                    return;
            }
        });
    } else {
        res.redirect('/');
    }
}

module.exports = getGradeStudentId;