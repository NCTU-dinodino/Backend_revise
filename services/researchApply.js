var query = require('../db/msql');
var nodemailer = require('nodemailer');
var mail_info = require('../../../auth/nctu/mail_info');

function researchApplySetAgree(req, res, next) {
    if (req.session.profile) {
        var info = req.body;
        if (info.agree == '1') {
            for (var i = 0; i < info.student.length; i++) {
                var req_member = { student_id: info.student[i].student_id, tname: info.tname, research_title: info.research_title, first_second: info.first_second, semester: info.year };
                query.CreateNewResearch(req_member, function (err) {
                    if (err) {
                        throw err;
                        res.redirect('/');
                    }
                });

            }
            var formInfo = { research_title: info.research_title, tname: info.tname, first_second: info.first_second, semester: info.year };
            query.DeleteResearchApplyForm(formInfo);

            setTimeout(function () {
                var mailString = '';
                var nameString = '';
                for (var j = 0; j < info.student.length; j++) {
                    mailString = mailString + info.student[j].mail + ',';
                    nameString = nameString + info.student[j].student_id + ',';
                }
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: mail_info.auth
                });

                var options = {
                    //寄件者
                    from: 'nctucsca@gmail.com',
                    //收件者
                    to: mailString,
                    //副本
                    cc: '',
                    //密件副本
                    bcc: '',
                    //主旨
                    subject: '[交大資工線上助理]專題申請狀態改變通知', // Subject line

                    html: '<p>此信件由系統自動發送，請勿直接回信！若有任何疑問，請直接聯絡您的老師跟同學,謝謝。</p><br/><p>申請狀態已變更, 請進入交大資工線上助理確認申請表狀態：<a href = "https://dinodino.nctu.edu.tw"> 點此進入系統</a></p><br/><br/><p>Best Regards,</p><p>交大資工線上助理 NCTU CSCA</p>'
                    //附件檔案

                };

                transporter.sendMail(options, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                });
                req.setAgree = { signal: 1 };
                if (req.setAgree)
                    next();
                else
                    return;
            }, 800);

        }
        else {
            var formInfo = { research_title: info.research_title, tname: info.tname, first_second: info.first_second, agree: info.agree, semester: info.year };
            query.SetResearchApplyFormStatus(formInfo);
            setTimeout(function () {
                var mailString = '';
                var nameString = '';
                for (var j = 0; j < info.student.length; j++) {
                    mailString = mailString + info.student[j].mail + ',';
                    nameString = nameString + info.student[j].student_id + ',';
                }
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: mail_info.auth
                });

                var options = {
                    //寄件者
                    from: 'nctucsca@gmail.com',
                    //收件者
                    to: mailString /*'joying62757@gmail.com'*/,
                    //副本
                    cc: /*req.body.sender_email*/'',
                    //密件副本
                    bcc: '',
                    //主旨
                    subject: '[交大資工線上助理]專題申請狀態改變通知', // Subject line
                    //純文字
                    /*text: 'Hello world2',*/ // plaintext body
                    //嵌入 html 的內文
                    html: '<p>此信件由系統自動發送，請勿直接回信！若有任何疑問，請直接聯絡 老師：' + ',學生：' + mailString + '謝謝。</p><br/><p>申請狀態已變更, 請進入交大資工線上助理確認申請表狀態：<a href = "https://dinodino.nctu.edu.tw"> 點此進入系統</a></p><br/><br/><p>Best Regards,</p><p>交大資工線上助理 NCTU CSCA</p>'
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
                req.setAgree = { signal: 1 };
                if (req.setAgree)
                    next();
                else
                    return;
            }, 800);
        }
    }
    else
        res.redirect('/');
}

function researchApplyList(req, res, next) {
    if (req.session.profile) {
        var teacher_id = res.locals.teacherId;
        query.ShowTeacherResearchApplyFormList(teacher_id, (err, result) => {
            if (err) {
                throw err;
                res.redirect('/');
            }
            if (!result)
                res.redirect('/');

            var apply_forms = JSON.parse(result);
            var projects = [];

            apply_forms.forEach((apply_form) => {
                if (apply_form.agree == '3')
                    return;
                if (!projects[apply_form.research_title]) {
                    let project = {
                        research_title: apply_form.research_title,
                        first_second: apply_form.first_second,
                        year: apply_form.semester,
                        status: apply_form.agree,
                        participants: []
                    };
                    projects[project.research_title] = project;
                }

                let student = {
                    student_id: apply_form.student_id,
                    sname: apply_form.sname,
                    email: apply_form.email,
                    phone: apply_form.phone,
                    first_second: apply_form.first_second,
                    student_status: apply_form.status
                };
                projects[apply_form.research_title].participants.push(student);
            });
            req.list = Object.keys(projects).map((key) => {
                return projects[key];
            });
            next();
        });
    } else
        res.redirect('/');
}

module.exports = {
    researchApplyList,
    researchApplySetAgree
}
