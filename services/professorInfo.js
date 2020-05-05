var query = require('../../../../db/msql');

/*列出教授以前指導過的專題*/
function professorInfoPastResearch(req, res, next) {
    if (req.session.profile) {
        var teacherId = req.body.teacher_id;
        var data = { teacher_id: teacherId };
        query.ShowGradeTeacherResearchStudent(teacherId, '', function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result) res.redirect('/');

            result = JSON.parse(result);
            var projects = [];
            var index = [];
            var count = 0;

            for (var i = 0; i < result.length; i++) {
                if (index[result[i].research_title] == null) {
                    if (result[i].first_second != '2') continue; //this api only want 專二
                    var project = {
                        research_title: '',
                        semester: '',
                        intro: '',
                    };
                    project.research_title = result[i].research_title;
                    project.semester = result[i].semester;
                    projects.push(project);
                    index[result[i].research_title] = count;
                    count++;
                }
            }
            if (count == projects.length) {
                req.pastResearch = projects;
                if (req.pastResearch)
                    next();
                else
                    return;
            }
        });
    } else {
        res.redirect('/');
    }

}

/*列出教授列表，及各教授相關資訊*/
function professorInfoList(req, res, next) {
    if (req.session.profile) {
        var info;
        var IDlist;
        var data = { teacher_id: '' };
        query.ShowTeacherInfoResearchCnt(data, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                var grade = req.query.year;
                var info = [];
                var flag;
                for (var i = 0; i < result.length; i++) {
                    for (var j = 0; j < result[i].gradeCnt.length; j++) {

                        if (result[i].gradeCnt[j].grade == grade) {
                            info.push({ tname: result[i].tname, teacher_id: result[i].teacher_id, phone: result[i].phone, email: result[i].email, expertise: result[i].expertise, info: result[i].info, photo: result[i].photo, scount: parseInt(result[i].gradeCnt[j].scount) });
                            flag = 1;
                            break;
                        }
                        else
                            flag = 0;
                    }
                    if (flag == 0)
                        info.push({ tname: result[i].tname, teacher_id: result[i].teacher_id, phone: result[i].phone, email: result[i].email, expertise: result[i].expertise, info: result[i].info, photo: result[i].photo, scount: 0 });
                }
                req.list = info;
                if (req.list)
                    next();
                else
                    return;
            }
        });

    }
    else {
        res.redirect('/');
    }

}

/*回傳該學生的導師*/
function professorInfoGetMentor(req, res, next) {
    if (req.session.profile) {
        var studentId = res.locals.studentId;
        query.ShowStudentMentor(studentId, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                req.getMentor = result;
                if (req.getMentor)
                    next();
                else
                    return;
            }
        });
    }
    else {
        res.redirect('/');
    }

}

module.exports = {
    professorInfoPastResearch,
    professorInfoList,
    professorInfoGetMentor
}
