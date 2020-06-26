var query = require('../../db/msql');

/* 回傳該學生英文狀態 */
function getGraduateEnglish(req, res, next) {
    if (req.session.profile) {
        // let personId = req.profile[0].student_id;
        let personId = res.locals.studentId;
        query.ShowUserInfo(personId, function (err, result) {
            if (err) {
                res.redirect('/');
            }
            else {
                var english = parseInt(JSON.parse(result)[0].en_certificate);
                if (english == null) english = 0;
                req.english = { status: english };
                if (req.english)
                    next();
                else
                    return;
            }
        });
    }
    else
        res.redirect('/');
}

module.exports = getGraduateEnglish;
