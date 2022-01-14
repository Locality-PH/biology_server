const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Teacher = db.teacher;
const Quiz = db.quiz;
var mongoose = require("mongoose");

exports.createQuiz = async (req, res) => {
    var newQid = new mongoose.Types.ObjectId();
    var newQuizData = req.body.newQuiz
    console.log("creating quiz")
    newQuizData["_id"] = newQid
    console.log(newQuizData)
    const newQuiz = new Quiz(newQuizData)
    await newQuiz.save()
    res.json(req.body)

};

