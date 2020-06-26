var query = require('../../db/msql')

/* 改變某學生的畢業送審狀態 */
function postGraduateCheck(req, res, next) {
    if (req.session.profile) {
        var data = {
            id: req.body.student_id,
            graduate_submit: req.body.graduate_submit
        };
        if (req.body.graduate_submit == 3) {
            data.reject_reason = req.body.reason;
        }
        //console.log(data);
        query.SetGraduateSubmitStatus(data, function (err, res) {
            if (err) {
                throw err;
                res.redirect('/');
            } else if (!res) {
                res.redirect('/');
            }
        });
        next();
    }
    else
        res.redirect('/');
}

module.exports = postGraduateCheck;
