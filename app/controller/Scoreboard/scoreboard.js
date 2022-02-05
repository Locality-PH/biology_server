const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Teacher = db.teacher;
const Quiz = db.classwork;
const Scoreboard = db.scoreboard;
var mongoose = require("mongoose");


exports.createScoreboard = async (req, res) => {
    var newData = req.body.tempValues
    var new_id = new mongoose.Types.ObjectId();
    var sid = mongoose.Types.ObjectId(newData.student_id);
    var cid = mongoose.Types.ObjectId(newData.classwork_id);
    var newScoreboardData = {
        _id: new_id,
        answer_list: newData.answer_list,
        score_list: newData.score_list,
        max_score: newData.max_score,
        score: newData.score,
        student: sid, 
        classwork: cid
    }

    const newScoreboard = new Scoreboard(newScoreboardData)

    // console.log(newScoreboardData)
    await newScoreboard.save()

    res.json(newScoreboardData)

};

exports.validateStudent = async (req, res) => {
    console.log(req.body)

    var cc = req.body.cc // classwork_code
    var sid = req.body.sid // student_id
    var classwork = await Quiz.findOne({classwork_link: cc});
    var cid = classwork._id

    console.log(classwork)
    console.log(cid)

    Scoreboard.findOne({classwork: cid, student: sid}, (err, result) => {
        if (err) {
            console.log(err)
            res.json("error");
        } else {
            res.json(result);
            console.log(result)
        }

    });
};