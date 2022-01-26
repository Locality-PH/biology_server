const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Teacher = db.teacher;
const Quiz = db.quiz;
const Scoreboard = db.scoreboard;
var mongoose = require("mongoose");


exports.createScoreboard = async (req, res) => {
    var newData = req.body.tempValues
    var new_id = new mongoose.Types.ObjectId();
    var sid = mongoose.Types.ObjectId(newData.student_id);
    var qid = mongoose.Types.ObjectId(newData.quiz_id);
    var newScoreboardData = {
        _id: new_id,
        answer_list: newData.answer_list,
        score_list: newData.score_list,
        max_score: newData.max_score,
        score: newData.score,
        student: sid, 
        quiz: qid
    }

    const newScoreboard = new Scoreboard(newScoreboardData)

    console.log(newScoreboardData)
    await newScoreboard.save()

    res.json(newScoreboardData)

};

exports.validateStudent = async (req, res) => {
    var qc = req.body.qc
    var sid = req.body.sid
    var quiz = await Quiz.findOne({quiz_link: qc});
    var qid = quiz._id

    console.log(quiz)
    console.log(qid)

    Scoreboard.findOne({question: qid, student: sid}, (err, result) => {
        if (err) {
            console.log(err)
            res.json("error");
        } else {
            res.json(result);
            console.log(result)
        }

    });
};