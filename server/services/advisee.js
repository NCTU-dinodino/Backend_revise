var query = require('../db/msql');


// assistants
/* 列出所有教授的資訊 */
function adviseeTeacherList(req, res, next) {
    if (req.session.profile) {
        query.ShowTeacherIdList(function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                var list = [];
                for (var i = 0; i < result.length; i++) {
                    var info = {
                        id: result[i].teacher_id,
                        name: result[i].tname,
                        status: 0,
                        email: result[i].email,
                        all_students: parseInt(result[i].all_students),
                        recent_failed: parseInt(result[i].recent_failed),
                        failed_students: parseInt(result[i].failed_students)
                    }
                    if (info.id == "T9303")
                        info.status = 1;
                    list.push(info);
                }
                if (list.length == result.length) {
                    req.teacherList = list;
                    if (req.teacherList)
                        next();
                    else
                        return;
                }
            }
        });
    }
    else
        res.redirect('/');
}

/* 列出該教授的所有導生的資訊 */
function adviseeStudentList(req, res, next) {
    if (req.session.profile) {
        var teacherId = req.body.teacher_id;
        query.ShowTeacherMentors(teacherId, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                var info = [];
                result = JSON.parse(result);
                for (var i = 0; i < result.length; i++) {
                    query.ShowUserInfo(result[i].student_id, function (err, profile) {
                        if (err) {
                            throw err;
                            res.redirect('/');
                        }
                        if (!profile) {
                            res.redirect('/');
                        } else {
                            profile = JSON.parse(profile);
                            profile = {
                                student_id: profile[0].student_id,
                                sname: profile[0].sname,
                                program: profile[0].program,
                                graduate: profile[0].graduate,
                                graduate_submit: profile[0].graduate_submit,
                                email: profile[0].email,
                                recent_failed: (profile[0].recent_failed == "true") ? true : false,
                                failed: (profile[0].failed == "failed") ? true : false
                            }
                            info.push(profile);
                        }
                        if (info.length == result.length) {
                            req.studentList = info;
                            if (req.studentList)
                                next();
                            else
                                return;
                        }
                    });
                }
            }
        });
    }
    else
        res.redirect('/');
}

/* 列出該學生每學期平均,有無被21,各科成績 */
function adviseeSemesterScoreList(req, res, next) {
    if (req.session.profile) {
        var input = req.body.student_id;
        query.ShowSemesterScore(input, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                var list = [];
                for (var i = 0; i < result.length; i++) {
                    var grade = {
                        semester: result[i].semester,
                        failed: result[i].failed == 'false' ? false : true,
                        avg: parseInt(result[i].avg),
                        credit: parseInt(result[i].credit),
                        score: []
                    };
                    for (var j = 0; j < result[i].score.length; j++) {
                        var scoreObj = {
                            cn: result[i].score[j].cn,
                            en: result[i].score[j].en,
                            score: (parseInt(result[i].score[j].score) > 0) ? parseInt(result[i].score[j].score) : null,
                            pass: result[i].score[j].pass == '通過' ? true : ((result[i].score[j].pass == 'W') ? 'W' : false)
                        }
                        grade.score.push(scoreObj);
                    }
                    if (grade.score.length == result[i].score.length)
                        list.push(grade);
                }
                if (list.length == result.length) {
                    req.scoreList = list;
                    if (req.scoreList)
                        next();
                    else
                        return;
                }
            }
        });
    }
    else
        res.redirect('/');
}
// assistants end

// professors
function adviseeSemesterGradeList(req, res, next) {
    if (req.session.profile) {
        var input = req.body.student_id;
        query.ShowSemesterScore(input, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                var list = [];
                for (var i = 0; i < result.length; i++) {
                    var grade = {
                        semester: result[i].semester,
                        failed: result[i].failed == 'false' ? false : true,
                        avg: parseInt(result[i].avg),
                        credit: parseInt(result[i].credit),
                        score: []
                    };
                    for (var j = 0; j < result[i].score.length; j++) {
                        var scoreObj = {
                            cn: result[i].score[j].cn,
                            en: result[i].score[j].en,
                            score: (parseInt(result[i].score[j].score) > 0) ? parseInt(result[i].score[j].score) : null,
                            pass: result[i].score[j].pass == '通過' ? true : ((result[i].score[j].pass == 'W') ? 'W' : false)
                        }
                        grade.score.push(scoreObj);
                    }
                    if (grade.score.length == result[i].score.length)
                        list.push(grade);
                }
                if (list.length == result.length) {
                    req.semesterGradeList = list;
                    if (req.semesterGradeList)
                        next();
                    else
                        return;
                }
            }
        });
    }
    else
        res.redirect('/');
}
function adviseeList(req, res, next) {
    if (req.session.profile) {
        var teacherId = res.locals.teacherId;
        query.ShowTeacherMentors(teacherId, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                var info = [];
                result = JSON.parse(result);

                for (var i = 0; i < result.length; i++) {
                    query.ShowUserInfo(result[i].student_id, function (err, profile) {
                        if (err) {
                            throw err;
                            return;
                        }
                        if (!profile) {
                            return;
                        }
                        else {
                            profile = JSON.parse(profile);
                            profile = {
                                student_id: profile[0].student_id,
                                sname: profile[0].sname,
                                program: profile[0].program,
                                graduate: profile[0].graduate,
                                graduate_submit: profile[0].graduate_submit,
                                email: profile[0].email,
                                recent_failed: (profile[0].recent_failed == "true") ? true : false,
                                failed: (profile[0].failed == "failed") ? true : false
                            }
                            info.push(profile);
                        }
                        if (info.length == result.length) {
                            req.list = info;
                            if (req.list)
                                next();
                            else
                                return;
                        }
                    });

                }
            }
        });
    }
    else
        res.redirect('/');
}
function adviseePersonalInfo(req, res, next) {
    if (req.session.profile) {
        query.ShowUserInfo(req.body.student_id, function (err, profile) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!profile) {
                res.redirect('/');
            }
            else {
                profile = JSON.parse(profile);
                profile = {
                    sname: profile[0].sname,
                    program: profile[0].program,
                    graduate: profile[0].graduate,
                    graduate_submit: profile[0].graduate_submit,
                    email: profile[0].email
                }
                req.personalInfo = profile;
                if (req.personalInfo)
                    next();
                else
                    return;
            }

        });

    }
    else
        res.redirect('/');
}
// professors end

module.exports = {
    adviseeTeacherList,
    adviseeStudentList,
    adviseeSemesterScoreList,
    adviseeSemesterGradeList,
    adviseeList,
    adviseePersonalInfo
}
