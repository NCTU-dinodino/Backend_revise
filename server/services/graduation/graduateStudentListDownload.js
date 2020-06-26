var query = require('../../db/msql')

/* 該年級所有學生的畢業預審下載 */
function graduateStudentListDownload(req, res, next) {
    if (req.session.profile) {
        var graduateList = [];
        var grade = { grade: req.body.grade };
        query.ShowGivenGradeStudentID(grade, function (error, studentList) {
            if (error) {
                throw error;
                res.redirect('/');
            }
            if (!studentList)
                res.redirect('/');
            studentList = JSON.parse(studentList);
            for (var i = 0; i < studentList.length; i++) {
                var student_id = { student_id: studentList[i].student_id };
                query.ShowStudentGraduate(student_id, function (err, result) {
                    if (err) {
                        throw err;
                        res.redirect('/');
                    }
                    if (!result)
                        res.redirect('/');
                    result = JSON.parse(result);
                    graduateList.push(result);
                });
            }
        });
        setTimeout(function () {
            req.studentListDownload = graduateList;
            if (req.studentListDownload)
                next();
            else
                return;
        }, 1000);
    }
    else
        res.redirect('/');
}

module.exports = graduateStudentListDownload;