var query = require('../../../../db/msql');
var nodemailer = require('nodemailer');
var mail_info = require('../../../auth/nctu/mail_info');

// students
function researchList(req, res, next) {
    if (req.session.profile) {
        var studentId = res.locals.studentId;
        query.ShowStudentResearchApplyForm(studentId, function (err, form) {
            if (!form)
                res.redirect('/');
            if (err) {
                throw err;
                res.redirect('/');
            }
            else {
                form = JSON.parse(form);
                query.ShowStudentResearchInfo(studentId, function (err, project) {
                    if (!project)
                        res.redirect('/');
                    if (err) {
                        throw err;
                        res.redirect('/');
                    }
                    else {
                        project = JSON.parse(project);
                        req.list = [...project, ...form];
                        if (req.list)
                            next();
                        else
                            return;
                    }

                });

            }
        });
    }
    else
        res.redirect('/');

}

/*回傳該學生填專題表時的狀況（status代表啥看db的github）*/
function researchShowStudentStatus(req, res, next) {
    if (req.session.profile) {
        var group = [];
        for (var i = 0; i < req.body.participants.length; i++) {
            query.ShowStudentResearchStatus(req.body.participants[i], function (err, result) {
                if (err) {
                    throw err;
                    res.redirect('/');
                }
                if (!result)
                    res.redirect('/');
                else {
                    result = JSON.parse(result);
                    group = [...group, ...result];
                }
            });
        }
        setTimeout(function () {
            req.status = group;
            if (req.status)
                next();
            else
                return;
        }, 200);
    }
    else
        res.redirect('/');
}

/*編輯專題的資訊*/
function researchEdit(req, res, next) {
    if (req.session.profile) {
        var info = req.body;
        var set_project = { tname: info.tname, research_title: info.research_title, first_second: info.first_second, semester: info.semester, new_title: info.research_title, new_file: info.new_file, new_photo: info.new_photo, new_filename: info.new_fileName, new_intro: info.new_intro };
        query.SetResearchInfo(set_project, function (err) {
            if (err) {
                throw err;
                res.redirect('/');
            }

        });
        setTimeout(function () {
            req.edit = { signal: 1 };
            if (req.edit)
                next();
            else
                return;
        }, 500);

    }
    else
        res.redirect('/');


}

/*更換專題教授，並寄送信件給教授*/
function researchSetReplace(req, res, next) {
    if (req.session.profile) {
        var info = {
            student_id: req.body.student_id,
            research_title: req.body.research_title,
            semester: req.body.semester,
            replace_pro: req.body.replace_pro
        };
        var student_email = '';
        query.ShowUserInfo(req.body.student_id, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            result = JSON.parse(result);
            student_email = result[0].email;
        });
        var tname = req.body.tname;
        query.ShowTeacherIdList(function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            result = JSON.parse(result);
            var teacher_email = '';
            for (var i = 0; i < result.length; i++) {
                if (result[i].tname == tname) {
                    teacher_email = result[i].email;
                }
            }
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: mail_info.auth
            });
            var options = {
                from: 'nctucsca@gmail.com',
                to: teacher_email,
                cc: '',
                bcc: '',
                subject: '[交大資工線上助理]學生申請<更換專題教授>通知', // Subject line
                html: '<p>此信件由系統自動發送，請勿直接回信！若有任何疑問，請直接聯絡 學生：' + student_email + ' 謝謝。</p><br/><p>申請狀態已變更, 請進入交大資工線上助理確認申請表狀態：<a href = "https://dinodino.nctu.edu.tw"> 點此進入系統</a></p><br/><br/><p>Best Regards,</p><p>交大資工線上助理 NCTU CSCA</p>'
            };
            query.SetResearchReplace(info, function (err, result) {
                if (err) {
                    throw err;
                    res.redirect('/');
                }
                if (!result) {
                    res.redirect('/');
                }
                else {
                    result = JSON.parse(result);
                    req.setReplace = { signal: result.info.affectedRows };
                    transporter.sendMail(options, function (err, info) {
                        if (err)
                            console.log(err);
                    });
                    if (req.setReplace)
                        next();
                    else
                        return;
                }
            });
        });
    }
    else {
        res.redirect('/');
    }

}

/*建立專題申請，並發送信件給學生*/
function researchApplyCreate(req, res, next) {
    if (req.session.profile) {
        var info = req.body;
        var data = {
            tname: info.tname,
            research_title: info.research_title,
            semester: info.semester
        };
        var signal = { signal: 1 };
        query.ShowResearchTitleNumber(data, function (error, result) {
            if (error) {
                throw error;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            var num = JSON.parse(result)[0]['count'];
            for (var i = 0; i < info.student_num; i++) {
                var studentInfo = { phone: info.phones[i], student_id: info.participants[i], research_title: info.research_title, tname: info.tname, first_second: info.first_second[i], email: info.email[i], semester: info.semester, program: info.department[i], name: info.name[i] };
                if (num != "1")
                    studentInfo.research_title += "_" + num;
                query.CreateResearchApplyForm(studentInfo, function (err, res1) {
                    if (err) {
                        throw err;
                        res.redirect('/');
                    }
                    if (res1 == 'wrong') {
                        signal.signal = 0;
                    }
                });
            }
        });

        setTimeout(function () {
            var mailString = '';
            var nameString = '';
            for (var j = 0; j < info.email.length; j++) {
                mailString = mailString + info.email[j] + ',';
                nameString = nameString + info.participants[j] + ',';
            }
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: mail_info.auth
            });

            var options = {
                //寄件者
                from: 'nctucsca@gmail.com',
                //收件者
                to: info.teacher_email,
                //副本
                cc: /*req.body.sender_email*/mailString,
                //密件副本
                bcc: '',
                //主旨
                subject: '[交大資工線上助理]專題申請郵件通知', // Subject line
                //純文字
                /*text: 'Hello world2',*/ // plaintext body
                //嵌入 html 的內文
                html: '<p>此信件由系統自動發送，請勿直接回信！若有任何疑問，請直接聯絡 老師：' + info.teacher_email + ',學生：' + mailString + '謝謝。</p><br/><p>請進入交大資工線上助理核可申請表/確認申請表狀態：<a href = "https://dinodino.nctu.edu.tw"> 點此進入系統</a></p><br/><br/><p>Best Regards,</p><p>交大資工線上助理 NCTU CSCA</p>'
                //附件檔案
                /*attachments: [ {
                    filename: 'text01.txt',
                    content: '聯候家上去工的調她者壓工，我笑它外有現，血有到同，民由快的重觀在保導然安作但。護見中城備長結現給都看面家銷先然非會生東一無中；內他的下來最書的從人聲觀說的用去生我，生節他活古視心放十壓心急我我們朋吃，毒素一要溫市歷很爾的房用聽調就層樹院少了紀苦客查標地主務所轉，職計急印形。團著先參那害沒造下至算活現興質美是為使！色社影；得良灣......克卻人過朋天點招？不族落過空出著樣家男，去細大如心發有出離問歡馬找事'
                }]*/
            };

            transporter.sendMail(options, function (error, info) {
                if (error) {
                    console.log(error);
                }
            });

            req.create = signal;
            if (req.create)
                next();
            else
                return;
        }, 1000);
    }
    else {
        res.redirect('/');
    }

}

/*刪除專題申請*/
function researchApplyDelete(req, res, next) {
    if (req.session.profile) {
        var info = req.body;
        var formInfo = { research_title: info.research_title, tname: info.tname, first_second: info.first_second, semester: info.semester };
        query.DeleteResearchApplyForm(formInfo);

        setTimeout(function () {
            req.delete = { signal: 1 };
            if (req.delete)
                next();
            else
                return;
        }, 1000);
    }
    else {
        res.redirect('/');
    }

}
// students end

// assistants
/*  列出該年級所有學生的專題資訊 */
function researchStudentList(req, res, next) {
    if (req.session.profile) {
        query.ShowGradeStudentIdList(req.body.grade, function (err, ID_list) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!ID_list)
                res.redirect('/');
            else {
                var project = [];
                var count = 0;
                var index = [];
                ID_list = JSON.parse(ID_list);
                for (var i = 0; i < ID_list.length; i++) {
                    var list = {
                        student: {
                            id: '',
                            name: '',
                            program: ''
                        },
                        project: {
                            status: 3,
                            title: '',
                            professor_name: ''
                        }
                    }
                    list.student.id = ID_list[i].student_id;
                    list.student.name = ID_list[i].sname;
                    list.student.program = ID_list[i].program;
                    index[ID_list[i].student_id] = count;
                    count++;
                    project.push(list);
                }
                for (var i = 0; i < ID_list.length; i++) {
                    query.ShowStudentResearchInfo(ID_list[i].student_id, function (err, research) {
                        if (err)
                            throw err;
                        if (!research)
                            res.redirect('/');
                        else {
                            research = JSON.parse(research);
                            if (research.length != 0) {
                                var id = index[research[research.length - 1].student_id];
                                if (research[research.length - 1].add_status == 0)
                                    project[id].project.status = 0;
                                else
                                    project[id].project.status = 1;
                                project[id].project.title = research[research.length - 1].research_title;
                                project[id].project.professor_name = research[research.length - 1].tname;
                            }
                        }
                    });
                }
                for (var i = 0; i < ID_list.length; i++) {
                    query.ShowStudentResearchApplyForm(ID_list[i].student_id, function (err, applyform) {
                        if (err)
                            throw err;
                        if (!applyform)
                            res.redirect('/');
                        else {
                            applyform = JSON.parse(applyform);
                            //console.log(applyform);
                            if (applyform.length != 0) {
                                //console.log(applyform[0].student_id);
                                var id = index[applyform[0].student_id.substring(0, 7)];

                                if (applyform[0].agree == 0 || applyform[0].agree == 2)
                                    project[id].project.status = 2;
                                //else if(applyform[0].agree == 3)
                                //	project[id].project.status =2;

                                project[id].project.title = applyform[0].research_title;
                                project[id].project.professor_name = applyform[0].tname;

                            }
                        }
                    });
                }
                setTimeout(function () {
                    req.studentList = project;
                    if (req.studentList)
                        next();
                    else
                        return;
                }, 500);
            }
        });
    }
    else
        res.redirect('/');
}

/* 列出所有學生的專題資訊 */
function researchStudentListDownload(req, res, next) {
    if (req.session.profile) {
        req.body.grade = '';
        var accept_num_semester = req.body.semester.substring(0, 3);
        var tid = { teacher_id: '' };
        query.ShowTeacherInfoResearchCnt(tid, function (err, ID_list) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!ID_list) res.redirect('/');
            else {
                var group = [];
                var Count = 0;
                var Index = [];
                ID_list = JSON.parse(ID_list);
                for (var i = 0; i < ID_list.length; i++) {
                    var list = {
                        professor_name: ID_list[i].tname,
                        accept_status: 0,
                        pending_status: 0,
                        gradeCnt: 0,
                        accepted: {
                            projects: [],
                        },
                        pending: {
                            projects: [],
                        },
                    };
                    for (var j = 0; j < ID_list[i].gradeCnt.length; j++) {
                        if (ID_list[i].gradeCnt[j].grade == accept_num_semester) {
                            list.gradeCnt = parseInt(ID_list[i].gradeCnt[j].scount);
                            break;
                        }
                    }
                    Index[ID_list[i].teacher_id] = Count;
                    Count++;
                    if (list.gradeCnt === null) list.gradeCnt = 0;
                    group.push(list);
                }
                var student_cnt = 0;
                for (var i = 0; i < ID_list.length; i++) {
                    query.ShowGradeTeacherResearchStudent(ID_list[i].teacher_id, req.body.grade, function (err, result) {
                        if (err) {
                            throw err;
                            return;
                        }
                        if (!result) return;
                        else {
                            result = JSON.parse(result);
                            var index = [];
                            var count = 0;
                            for (var j = 0; j < result.length; j++) {
                                if (index[result[j].research_title] == null && result[j].semester == req.body.semester) {
                                    var project = {
                                        title: '',
                                        students: [],
                                        title_number: ''
                                    };
                                    project.title = result[j].research_title;
                                    var Id = Index[result[j].teacher_id];
                                    group[Id].accepted.projects.push(project);
                                    index[result[j].research_title] = count;
                                    count++;
                                }
                            }
                            for (var j = 0; j < result.length; j++) {
                                if (result[j].semester == req.body.semester) {
                                    var student = {
                                        id: '',
                                        name: '',
                                        program: '',
                                        semester: '',
                                        first_second: '',
                                        status: null,
                                        add_status: 0
                                    };
                                    student.id = result[j].student_id;
                                    student.name = result[j].sname;
                                    student.program = result[j].class_detail;
                                    student.semester = result[j].semester;
                                    student.first_second = result[j].first_second;
                                    student.status = result[j].status;
                                    student.add_status = result[j].add_status;
                                    var id = index[result[j].research_title];
                                    var Id = Index[result[j].teacher_id];
                                    group[Id].accepted.projects[id].students.push(student);
                                    student_cnt++;
                                    if (result[j].add_status == 0 && group[Id].accept_status == 0)
                                        group[Id].accept_status = 1;
                                }
                            }
                        }
                    });
                }
                for (var i = 0; i < ID_list.length; i++) {
                    query.ShowTeacherResearchApplyFormList(ID_list[i].teacher_id, function (err, result) {
                        if (err) {
                            throw err;
                            return;
                        }
                        if (!result) return;
                        else {
                            result = JSON.parse(result);
                            var index = [];
                            var count = 0;
                            for (var j = 0; j < result.length; j++) {
                                if (index[result[j].research_title] == null) {
                                    var project = {
                                        title: '',
                                        students: [],
                                        title_number: '',
                                    };
                                    project.title = result[j].research_title;
                                    var Id = Index[result[j].teacher_id];
                                    group[Id].pending.projects.push(project);
                                    index[result[j].research_title] = count;
                                    count++;

                                    if (group[Id].pending_status == 0) group[Id].pending_status = 1;
                                }
                            }
                            for (var j = 0; j < result.length; j++) {
                                var student = {
                                    id: '',
                                    name: '',
                                    program: '',
                                    first_second: '',
                                    status: null,
                                };
                                student.id = result[j].student_id;
                                student.name = result[j].sname;
                                student.program = result[j].program;
                                student.first_second = result[j].first_second;
                                student.status = result[j].status;
                                var id = index[result[j].research_title];
                                var Id = Index[result[j].teacher_id];
                                group[Id].pending.projects[id].students.push(student);
                                student_cnt++;
                            }
                        }
                    });
                }
                var return_list = [];
                setTimeout(function () {
                    for (var i = 0; i < group.length; i++) {
                        var Tname = group[i].professor_name;
                        var project_ac_list = group[i].accepted.projects;
                        var project_pending_list = group[i].pending.projects;
                        for (var j = 0; j < project_ac_list.length; j++) {
                            var student_list = project_ac_list[j].students;
                            for (var k = 0; k < student_list.length; k++) {
                                var student = {
                                    student_id: '',
                                    sname: '',
                                    tname: '',
                                    research_title: '',
                                    first_second: '',
                                };
                                student.tname = Tname;
                                student.research_title = project_ac_list[j].title;
                                student.student_id = student_list[k].id;
                                student.sname = student_list[k].name;
                                student.first_second = student_list[k].first_second;
                                return_list.push(student);
                            }
                        }
                        for (var j = 0; j < project_pending_list.length; j++) {
                            var student_list = project_pending_list[j].students;
                            for (var k = 0; k < student_list.length; k++) {
                                var student = {
                                    student_id: '',
                                    sname: '',
                                    tname: '',
                                    research_title: '',
                                    first_second: '',
                                };
                                student.tname = Tname;
                                student.research_title = project_pending_list[j].title;
                                student.student_id = student_list[k].id;
                                student.sname = student_list[k].name;
                                student.first_second = student_list[k].first_second;
                                return_list.push(student);
                            }
                        }
                    }
                    if (return_list.length == student_cnt) {
                        req.studentListDownload = return_list;
                        if (req.studentListDownload)
                            next();
                        else
                            return;
                    }
                }, 1000);
            }
        });
    }
    else
        res.redirect('/');
}

/* 列出該教授的專題學生資訊 */
function researchProfessorList(req, res, next) {
    if (req.session.profile) {
        var accept_num_semester = req.body.year;
        var year_semester = req.body.year + '-' + req.body.semester;
        var tid = { teacher_id: '' }
        query.ShowTeacherInfoResearchCnt(tid, function (err, ID_list) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!ID_list)
                res.redirect('/');
            else {
                var group = [];
                var Count = 0;
                var Index = [];
                ID_list = JSON.parse(ID_list);
                for (var i = 0; i < ID_list.length; i++) {
                    var list = {
                        professor_name: ID_list[i].tname,
                        accept_status: 0,
                        pending_status: 0,
                        gradeCnt: 0,
                        accepted: {
                            projects: []
                        },
                        pending: {
                            projects: []
                        }
                    }
                    for (var j = 0; j < ID_list[i].gradeCnt.length; j++) {
                        if (ID_list[i].gradeCnt[j].grade == accept_num_semester) {
                            list.gradeCnt = parseInt(ID_list[i].gradeCnt[j].scount);
                            break;
                        }
                    }
                    Index[ID_list[i].teacher_id] = Count;
                    Count++;
                    if (list.gradeCnt === null)
                        list.gradeCnt = 0;
                    group.push(list);
                }
                for (var i = 0; i < ID_list.length; i++) {
                    query.ShowGradeTeacherResearchStudent(ID_list[i].teacher_id, '', function (err, result) {
                        if (err) {
                            throw err;
                            return;
                        }
                        if (!result)
                            return;
                        else {
                            result = JSON.parse(result);
                            var index = [];
                            var count = 0;
                            for (var j = 0; j < result.length; j++) {
                                if ((index[result[j].research_title] == null) && (result[j].semester == year_semester)
                                    && ((result[j].first_second == req.body.first_second) || ((result[j].first_second == '3') && (req.body.first_second == '1')))) {
                                    var project = {
                                        title: '',
                                        students: [],
                                    }
                                    project.title = result[j].research_title;
                                    var Id = Index[result[j].teacher_id];
                                    group[Id].accepted.projects.push(project);
                                    index[result[j].research_title] = count;
                                    count++;
                                }
                            }
                            for (var j = 0; j < result.length; j++) {
                                if ((result[j].semester == year_semester) && ((result[j].first_second == req.body.first_second) || ((result[j].first_second == '3') && (req.body.first_second == '1')))) {
                                    var student = {
                                        id: '',
                                        name: '',
                                        program: '',
                                        semester: '',
                                        first_second: '',
                                        status: null,
                                        add_status: 0
                                    }
                                    student.id = result[j].student_id;
                                    student.name = result[j].sname;
                                    student.program = result[j].class_detail;
                                    student.semester = result[j].semester;
                                    student.first_second = result[j].first_second;
                                    student.status = result[j].status;
                                    student.add_status = result[j].add_status;
                                    var id = index[result[j].research_title];
                                    var Id = Index[result[j].teacher_id];
                                    group[Id].accepted.projects[id].students.push(student);
                                    if ((result[j].add_status == 0) && (group[Id].accept_status == 0))
                                        group[Id].accept_status = 1;
                                }
                            }
                        }
                    });
                }
                for (var i = 0; i < ID_list.length; i++) {
                    query.ShowTeacherResearchApplyFormList(ID_list[i].teacher_id, function (err, result) {
                        if (err) {
                            throw err;
                            return;
                        }
                        if (!result)
                            return;
                        else {
                            result = JSON.parse(result);
                            var index = [];
                            var count = 0;
                            for (var j = 0; j < result.length; j++) {
                                if (index[result[j].research_title] == null && (result[j].semester == year_semester) && ((result[j].first_second == req.body.first_second) || ((result[j].first_second == '3') && (req.body.first_second == '1')))) {
                                    var project = {
                                        title: '',
                                        students: [],
                                    }
                                    project.title = result[j].research_title;
                                    var Id = Index[result[j].teacher_id];
                                    group[Id].pending.projects.push(project);
                                    index[result[j].research_title] = count;
                                    count++;
                                    if (group[Id].pending_status == 0)
                                        group[Id].pending_status = 1;
                                }
                            }
                            for (var j = 0; j < result.length; j++) {
                                if ((result[j].semester == year_semester) && ((result[j].first_second == req.body.first_second) || ((result[j].first_second == '3') && (req.body.first_second == '1')))) {
                                    var student = {
                                        id: '',
                                        name: '',
                                        program: '',
                                        first_second: '',
                                        semester: '',
                                        status: null
                                    }
                                    student.id = result[j].student_id;
                                    student.name = result[j].sname;
                                    student.program = result[j].program;
                                    student.first_second = result[j].first_second;
                                    student.semester = result[j].semester;
                                    student.status = result[j].status;
                                    var id = index[result[j].research_title];
                                    var Id = Index[result[j].teacher_id];
                                    group[Id].pending.projects[id].students.push(student);
                                }
                            }
                        }
                    });
                }
                setTimeout(function () {
                    req.professorList = group;
                    if (req.professorList)
                        next();
                    else
                        return;
                }, 1000);
            }
        });
    }
    else
        res.redirect('/');
}

/*  列出該學期專題一或二的所有成績資訊 */
function researchGradeList(req, res, next) {
    if (req.session.profile) {
        var input = { semester: req.body.semester, first_second: req.body.first_second };
        query.ShowResearchScoreComment(input, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            else {
                result = JSON.parse(result);
                var index = [];
                var groups = [];
                for (var i = 0; i < result.length; i++) {
                    var list = {
                        professor_name: '',
                        student: {
                            id: '',
                            name: '',
                            score: null,
                            comment: ''
                        }
                    }
                    list.professor_name = result[i].tname;
                    list.student.id = result[i].student_id;
                    list.student.name = result[i].sname;
                    list.student.score = parseInt(result[i].score);
                    list.student.comment = result[i].comment;
                    list.student.research_title = result[i].research_title;
                    groups.push(list);
                }
                if (groups.length == result.length) {
                    req.gradeList = groups;
                    if (req.gradeList)
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

/* 該學期專題一或二的成績表下載 */
function researchGradeDownload(req, res, next) {
    if (req.session.profile) {
        var input = { semester: req.body.semester, first_second: req.body.first_second };
        query.ShowResearchScoreComment(input, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            result = JSON.parse(result)
            req.gradeDownload = result;
            if (req.gradeDownload)
                next();
            else
                return;
        });
    }
    else
        res.redirect('/');
}

/* 助理更改該學生專題成績和評論 */
function researchSetScore(req, res, next) {
    if (req.session.profile) {
        var content = {
            student_id: req.body.student_id,
            tname: req.body.tname,
            research_title: req.body.research_title,
            first_second: parseInt(req.body.first_second),
            semester: req.body.semester,
            new_score: parseInt(req.body.new_score),
            new_comment: req.body.new_comment
        };
        query.SetResearchScoreComment(content, function (err, result) {
            if (err)
                throw err;
            var signal = { signal: 1 };
            req.setScore = signal;
            if (req.setScore)
                next();
            else
                return;
            res.send(result);
        });
    }
}

/* 刪除該學生的專題資訊(讓助理可以刪掉CPE未過但被教授同意的人的專題) */
function researchDelete(req, res, next) {
    if (req.session.profile) {
        var info = { student_id: req.body.student_id, first_second: req.body.first_second, semester: req.body.semester };
        query.DeleteResearch(info, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            result = JSON.parse(result);
            req.delete = result;
            if (req.delete)
                next();
            else
                return;
        });
    } else {
        res.redirect('/');
    }
}

/* 修改專題資料的 add_status, 0代表尚未加選 1代表已加選 */
function researchSetAddStatus(req, res, next) {
    if (req.session.profile) {
        var info = {
            student_id: req.body.student_id,
            research_title: req.body.research_title,
            semester: req.body.semester,
            first_second: req.body.first_second,
            add_status: 1
        };
        query.SetResearchAddStatus(info, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            result = JSON.parse(result);
            req.setAddStatus = result;
            if (req.setAddStatus)
                next();
            else
                return;
        });
    }
    else
        res.redirect('/');
}

/* CPE未通過申請專題:first_second = 3, 助理確認CPE通過後可將 3 改為 1 */
function researchSetFirstSecond(req, res, next) {
    if (req.session.profile) {
        let student_id = { student_id: req.body.student_id };
        query.SetFirstSecond(student_id, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');
            result = JSON.parse(result);
            var signal = {
                signal: (parseInt(result.info.affectedRows) > 0) ? 1 : 0
            }
            req.setFirstSecond = signal;
            if (req.setFirstSecond)
                next();
            else
                return;
        });
    } else {
        res.redirect('/');
    }
}
// assistants end

// professors
function researchSetScore(req, res, next) {
    if (req.session.profile) {
        var content = {
            student_id: '',
            tname: '',
            research_title: '',
            first_second: 0,
            semester: '',
            new_score: 0,
            new_comment: ''
        }
        var info = req.body;
        query.ShowStudentFirstSecond(info.student_id, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');

            result = JSON.parse(result);
            var fir_sec = parseInt(result[0].first_second);
            content.student_id = info.student_id;
            content.tname = info.tname;
            content.research_title = info.research_title;
            content.first_second = fir_sec;
            content.semester = info.year;
            content.new_score = parseInt(info.new_score);
            content.new_comment = info.comment;
        });

        setTimeout(function () {
            /*query.SetResearchScoreComment(content, function(err,result){
                if(err) throw err;
                var signal = { signal: 1 };
                req.setScore = signal;
                if(req.setScore)
                    next();
                else
                    return;
                res.send(result);
            });*/
            query.SetResearchScoreComment(content);
            req.setScore = { signal: content };
            if (req.setScore)
                next();
            else
                return;
        }, 800);
    }
    else
        res.redirect('/');
}

function researchSetTitle(req, res, next) {
    if (req.session.profile) {
        var info = req.body;
        var content = { research_title: info.research_title, tname: info.tname, first_second: info.first_second, semester: info.year, new_title: info.new_title };

        query.SetResearchTitle(content);
        setTimeout(function () {
            req.setTitle = { signal: 1 };
            if (req.setTitle)
                next();
            else
                return;
        }, 800);
    }
    else
        res.redirect('/');

}
function researchList(req, res, next) {
    if (req.session.profile) {

        var info = req.body;
        var teacher_id = info.teacherId;
        var sem = info.sem;
        var group_list = [];

        var tname = "";
        var data = { teacher_id: teacher_id }
        query.ShowGradeTeacherResearchStudent(teacher_id, '', function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');

            result = JSON.parse(result);
            if (result.length == 0) {
                var projects = {
                    groups: []
                }
            }
            else {
                var index = [];
                var temp = result[0].research_title;
                var projects = {
                    cs_number: 0, //*
                    other_number: 0, //*
                    current_accept: 0,
                    groups: []
                }

                var count = 0;

                for (var i = 0; i < result.length; i++) {
                    if (index[result[i].research_title] == null) {
                        if (result[i].semester != sem) continue;
                        var project = {
                            research_title: '',
                            participants: [],
                            year: '',
                            first_second: '',
                        }
                        project.year = result[i].semester;
                        project.research_title = result[i].research_title;
                        project.first_second = result[i].first_second;
                        projects.groups.push(project);
                        index[result[i].research_title] = count;
                        count++;
                    }
                }
                var cs_number = 0, other_number = 0, cnt = 0;
                for (var i = 0; i < result.length; i++) {
                    if (result[i].semester != sem) continue;
                    var student = {
                        student_id: '',
                        sname: '',
                        detail: '',
                        comment: '',
                        replace_pro: 0,
                        score: null
                    }
                    student.student_id = result[i].student_id;
                    student.score = parseInt(result[i].score);
                    student.sname = result[i].sname;
                    student.detail = result[i].class_detail;
                    student.comment = result[i].comment;
                    student.replace_pro = parseInt(result[i].replace_pro);
                    var id = index[result[i].research_title];
                    projects.groups[id].participants.push(student);

                    query.ShowStudentResearchInfo(student.student_id, function (error, res) {
                        if (error) {
                            throw error;
                            res.redirect('/');
                        }
                        if (!res) {
                            res.redirect('/');
                        }
                        res = JSON.parse(res);
                        if (res[0].status == "1") {
                            cs_number++;
                        }
                        else {
                            other_number++;
                        }
                    });
                }
                setTimeout(function () {
                    projects.cs_number = cs_number;
                    projects.other_number = other_number;
                    var group_len = projects.groups.length;
                    query.ShowTeacherInfoResearchCnt(data, function (err, result) {
                        if (err) {
                            throw err;
                            res.redirect('/');
                        }
                        if (!result) {
                            res.redirect('/');
                        }
                        else {
                            result = JSON.parse(result);
                            tname = result[0].tname;

                            var grade = sem.substring(0, 3);
                            for (var j = 0; j < result[0].gradeCnt.length; j++) {
                                if (result[0].gradeCnt[j].grade == grade) {
                                    projects.current_accept = result[0].gradeCnt[j].scount;
                                    break;
                                }
                            }
                            for (let i = 0; i < group_len; i++) {
                                var group = {
                                    research_title: projects.groups[i].research_title,
                                    participants: projects.groups[i].participants,
                                    year: projects.groups[i].year,
                                    first_second: projects.groups[i].first_second
                                };
                                group_list.push(group);
                            }
                            if (group_list.length === group_len) {
                                projects.groups = group_list;
                                req.list = projects;
                                if (req.list)
                                    next();
                                else
                                    return;
                            }
                        }
                    });

                }, 1000);
            }
        });
    }
    else {
        res.redirect('/');
    }
}

function researchSetReplace(req, res, next) {
    if (req.session.profile) {
        var info = req.body;
        var set_content = { student_id: info.student_id, research_title: info.research_title, semester: info.semester, replace_pro: 0 };
        var del_content = { student_id: info.student_id, first_second: info.first_second, semester: info.semester };
        var student_email = '';
        query.ShowUserInfo(info.student_id, function (err, result) {
            if (err) {
                throw err;
                res.redirect('/');
            } else {
                result = JSON.parse(result);
                student_email = result[0].email;
            }
        });
        setTimeout(function () {
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: mail_info.auth
            });
            var options = {
                //寄件者
                from: 'nctucsca@gmail.com',
                //收件者
                to: student_email /*'joying62757@gmail.com'*/,
                //副本
                cc: /*req.body.sender_email*/'',
                //密件副本
                bcc: '',
                //主旨
                subject: '[交大資工線上助理]專題申請狀態改變通知', // Subject line
                //純文字
                /*text: 'Hello world2',*/ // plaintext body
                //嵌入 html 的內文
                html: '<p>此信件由系統自動發送，請勿直接回信！若有任何疑問，請直接聯絡您的老師，謝謝。</p><br/><p>申請狀態已變更, 請進入交大資工線上助理確認申請表狀態：<a href = "https://dinodino.nctu.edu.tw"> 點此進入系統</a></p><br/><br/><p>Best Regards,</p><p>交大資工線上助理 NCTU CSCA</p>'
                //附件檔案
    			/*attachments: [ {
        			filename: 'text01.txt',
        			content: '聯候家上去工的調她者壓工，我笑它外有現，血有到同，民由快的重觀在保導然安作但。護見中城備長結現給都看面家銷先然非會生東一無中；內他的下來最書的從人聲觀說的用去生我，生節他活古視心放十壓心急我我們朋吃，毒素一要溫市歷很爾的房用聽調就層樹院少了紀苦客查標地主務所轉，職計急印形。團著先參那害沒造下至算活現興質美是為使！色社影；得良灣......克卻人過朋天點招？不族落過空出著樣家男，去細大如心發有出離問歡馬找事'
    			}]*/
            };
            if (info.agree_replace) {
                query.DeleteResearch(del_content, function (err, result) {
                    if (err) {
                        throw err;
                        res.redirect('/');
                    }
                    options.subject = '[交大資工線上助理]同意教授更換申請郵件通知';
                    transporter.sendMail(options, function (err, info) {
                        if (err)
                            console.log(err);
                    });
                    result = JSON.parse(result);
                    req.reply = result;
                    if (req.reply)
                        next();
                    else
                        return;
                });
            } else {
                query.SetResearchReplace(set_content, function (err, result) {
                    if (err) {
                        throw err;
                        res.redirect('/');
                    }
                    options.subject = '[交大資工線上助理]不同意教授更換申請郵件通知';
                    transporter.sendMail(options, function (err, info) {
                        if (err)
                            console.log(err);
                    });
                    result = JSON.parse(result);
                    req.reply = result;
                    if (req.reply)
                        next();
                    else
                        return;
                });
            }
        }, 800);
    } else {
        res.redirect('/');
    }
}
// professors end

module.exports = {
    // students
    researchList,
    researchEdit,
    researchSetReplace,
    researchApplyCreate,
    researchApplyDelete,
    researchShowStudentStatus,
    // assistants
    researchStudentList,
    researchProfessorList,
    researchGradeList,
    researchGradeDownload,
    researchSetScore,
    researchDelete,
    researchSetAddStatus,
    researchSetFirstSecond,
    researchStudentListDownload,
    // professors
    researchSetScore,
    researchSetTitle,
    researchList,
    researchSetReplace
}
