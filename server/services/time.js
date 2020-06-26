var query = require('../db/msql');


function createApplyPeriod(req, res, next) {
    if (req.session.profile) {
        var input = req.body;
        var info = { semester: '', type: '', begin: '', end: '' };
        info.semester = input.semester;
        if (input.hasOwnProperty('graduation')) {
            info.type = 'graduation';
            info.begin = input.graduation.begin;
            info.end = input.graduation.end;
        }
        else if (input.hasOwnProperty('project')) {
            info.type = 'research';
            info.begin = input.project.begin;
            info.end = input.project.end;
        }
        else if (input.hasOwnProperty('verify')) {
            info.type = 'offset';
            info.begin = input.verify.begin;
            info.end = input.verify.end;
        }
        query.CreateApplyPeriod(info, function (err, result) {
            if (err) {
                req.signal = 403
                throw err
            }
            if (!result) {
                req.signal = 403
                next()
            }
            else {
                req.signal = 204
                next()
            }
        });
    }
    else
        res.redirect('/');
}

function setApplyPeriod(req, res, next) {
    if (req.session.profile) {
        var input = req.body;
        var info = { semester: '', type: '', begin: '', end: '' };
        info.semester = input.semester;
        if (input.hasOwnProperty('graduation')) {
            info.type = 'graduation';
            info.begin = input.graduation.begin;
            info.end = input.graduation.end;
        }
        else if (input.hasOwnProperty('project')) {
            info.type = 'research';
            info.begin = input.project.begin;
            info.end = input.project.end;
        }
        else if (input.hasOwnProperty('verify')) {
            info.type = 'offset';
            info.begin = input.verify.begin;
            info.end = input.verify.end;
        }
        query.SetApplyPeriod(info, function (err, result) {
            if (err) {
                req.signal = 403
                throw err
            }
            if (!result) {
                req.signal = 403
                next()
            }
            else {
                req.signal = 204
                next()
            }
        });
    }
    else
        res.redirect('/');
}

function showApplyPeriod(req, res, next) {
    if (req.session.profile) {
        var input = req.body;
        //var input = {semester: '108-1'};
        query.ShowApplyPeriod(input, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            result = JSON.parse(result);
            var output = {
                "verify": {
                    "begin": "",
                    "end": ""
                },
                "project": {
                    "begin": "",
                    "end": ""
                },
                "graduation": {
                    "begin": "",
                    "end": ""
                }
            };
            output.verify.begin = result.offset.begin;
            output.verify.end = result.offset.end;
            output.project.begin = result.research.begin;
            output.project.end = result.research.end;
            output.graduation.begin = result.graduation.begin;
            output.graduation.end = result.graduation.end;
            req.showApplyPeriod = output;
            if (req.showApplyPeriod)
                next();
            else
                return;
        });
    }
    else
        res.redirect('/');
}

module.exports = {
    showApplyPeriod,
    createApplyPeriod,
    setApplyPeriod
}
