const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Student = db.student;
const Teacher = db.teacher;
const Quiz = db.quiz;
var mongoose = require("mongoose");


exports.createQuiz = async (req, res) => {
    var newQid = new mongoose.Types.ObjectId();
    var newQuizData = req.body.newQuiz
    var tid = req.body.tid

    newQuizData["_id"] = newQid
    const newQuiz = new Quiz(newQuizData)
    await newQuiz.save()

    try {
        Teacher.updateOne({ _id: tid }, { $push: { quiz: [newQid] } }, (err, result) => {
            if (err) {
                console.log(err)
            }
        })
    } catch (e) {
        console.log(e);
    }

    res.json(req.body)

};

exports.getQuiz = async (req, res) => {
    var Qid = req.params.Qid
    console.log(Qid)

    try {
        Quiz.findById(Qid, (err, result) => {
            if (err) {
                console.log(err)
                res.json("error");
            } else {
                res.json(result);
            }
        })
    } catch (error) {
        console.log(error)
    }

};

exports.getTeacherQuizByCode = async (req, res) => {
    var quiz_code = req.params.quiz_code
    var tid = req.body.tid
    var teacher = await Teacher.findById(tid).populate("quiz");
    let isQuizValid = false

    teacher.quiz.map((quiz) => {
        if (quiz.quiz_link == quiz_code) {
            isQuizValid = true
        }
    })

    if (isQuizValid) {
        try {
            Quiz.findOne({ quiz_link: quiz_code }, (err, result) => {
                if (err) {
                    console.log(err)
                    res.json("error");
                } else {
                    res.json(result);
                }
            })
        } catch (error) {
            console.log(error)
        }
    } else {
        res.json("failed")
    }

};

exports.getStudentQuizByCode = async (req, res) => {
    var quiz_code = req.params.quiz_code
    var sid = req.body.sid
    var cc = req.body.class_code
    let isStudentValid = false

    var student = await Student.findById(sid).populate("classroom");

    student.classroom.map((classroom) => {
        if (classroom.class_code == cc) {
            isStudentValid = true
        }
    })

    if (isStudentValid) {
        try {
            Quiz.findOne({ quiz_link: quiz_code }, (err, result) => {
                if (err) {
                    console.log(err)
                    res.json("error");
                } else {
                    res.json(result);
                }
            })
        } catch (error) {
            console.log(error)
        }
    } else {
        res.json("failed")
    }


};

exports.getAllQuiz = async (req, res) => {

    const tid = req.params.tid

    Teacher.findOne({ _id: tid }).populate("quiz").exec((err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.json(result.quiz)
        }
    })

};

exports.updateQuiz = async (req, res) => {
    var qid = req.body.quiz_id;
    var newQuizData = req.body.newQuiz
    var tid = req.body.tid

    console.log(req.body)
    console.log(qid)
    console.log(newQuizData)

    try {
        Quiz.updateOne({ _id: qid }, newQuizData, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
            }
        })
    } catch (e) {
        console.log(e);
    }


};

exports.deleteQuiz = async (req, res) => {

    console.log(req.body)

    const tid = req.body.tid
    const Qid = req.body.Qid

    Teacher.updateOne({ _id: tid }, { $pull: { quiz: Qid } }, (err, result) => {
        if (err) {
            return res.json("Error")
        }
        else {
            Quiz.deleteOne({ _id: Qid }, (err, result) => {
                if (err) {
                    return res.json("Error")
                }
                else {
                    return res.json("Deleted")
                }
            })
        }
    })

};


