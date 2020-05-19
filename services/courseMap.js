var query = require('..db/msql');

/*課程地圖規則*/
function courseMapRule(req, res, next){
    if (req.session.profile) {
        var studentId = res.locals.studentId;
        query.ShowCosMapRule(studentId, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result) {
                res.redirect('/');
            }
            else {
                result = JSON.parse(result);
                req.rule = result;
                if (req.rule)
                    next();
                else
                    return;
            }
        });
    }
    else
        res.redirect('/');

}

/*課程地圖上通過的課*/
function courseMapPass(req, res, next) {
    if (req.session.profile) {
        var studentId = res.locals.studentId;
        query.ShowCosMapPass(studentId, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result) {
                res.redirect('/');
            }
            else {
                result = JSON.parse(result);
                req.pass = result;
                if (req.pass)
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
    courseMapRule,
    courseMapPass
};
