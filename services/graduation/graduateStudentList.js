const { query } = require("express");

var query = require('../../db/msql')

/* 列出該年級所有學生的畢業預審 */
function graduateStudentList (req, res, next) {
    var grades = { grade: req.body.grade };
    var list = [];
    if (req.session.profile) {
        query.ShowGivenGradeStudentID(grades, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            } else if (!result) {
                res.redirect('/');
            } else {
                var all_result = JSON.parse(result);
                for (var i = 0; i < all_result.length; i++) {
                    var studentID = { student_id: all_result[i].student_id };
                    // var studentID = {student_id: '0616220'};
                    // list.push(studentID);
                    query.ShowStudentGraduate(studentID, function (err, graduate_result) {
                        if (err) {
                            throw err;
                            res.redirect('/');
                        } else if (!graduate_result) {
                            res.redirect('/');
                        } else {
                            var output = JSON.parse(graduate_result)
                            output.map(student => {
                                if (student.submit_status === null) { student.submit_status = 0; }
                                if (student.submit_type === null) { student.submit_type = 0; }
                                if (student.en_status === null) { student.en_status = 0; }
                                student.submit_status = parseInt(student.submit_status);
                                list.push(student);
                                // list.push(studentID);
                            });
                            // list.push(studentID);
                            // list.push(JSON.parse(graduate_result));
                        }
                    });
                }
            }
        });
        setTimeout(function () {
            req.studentList = list;
            if (req.studentList)
                next();
            else
                return;
        }, 500);
    } else {
        res.redirect('/');
    }
}

module.exports = graduateStudentList;
