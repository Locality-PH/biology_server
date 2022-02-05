const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Teacher = db.teacher;
const Classwork = db.classwork;
const Scoreboard = db.scoreboard;
const StudentEnrolled = db.student_enrolled
const Lesson = db.lessons
const ModuleLesson = db.modulelessons
const Module = db.modules
var mongoose = require("mongoose");


exports.createScoreboard = async (req, res) => {
    var newData = req.body.tempValues
    var ct = newData.classwork_type
    var mal_id = newData.mal_id
    var cc = newData.class_code

    var new_id = new mongoose.Types.ObjectId();
    var sid = mongoose.Types.ObjectId(newData.student_id);

    var classroom = await Classroom.findOne({class_code: cc})
    var cid = classroom._id

    var newScoreboardData = {
        _id: new_id,
        answer_list: newData.answer_list,
        score_list: newData.score_list,
        max_score: newData.max_score,
        score: newData.score,
        student: sid, 
        mal_id
    }

    const newScoreboard = new Scoreboard(newScoreboardData)
    await newScoreboard.save()

    var student_enrolled = await StudentEnrolled.findOne({ students: sid,  classroom_id: cid})
    var student_enrolled_id = student_enrolled._id

    if (ct == "activity") {
        await StudentEnrolled.updateOne({ students: sid,  classroom_id: cid}, { $push: { lesson_finish: [mal_id] } })
        await ModuleLesson.updateOne({_id: mal_id}, { $push: { finished: [student_enrolled_id] } })
    }

    if (ct == "quiz") {
        await StudentEnrolled.updateOne({ students: sid,  classroom_id: cid}, { $push: { module_finish: [mal_id] } })
        await Module.updateOne({_id: mal_id}, { $push: { finished: [student_enrolled_id] } })
    }

    res.json(newScoreboardData)


};

exports.validateStudent = async (req, res) => {
    console.log(req.body)

    var sid = req.body.sid // student_id
    var mal_id = req.body.mal_id 

    Scoreboard.findOne({mal_id: mal_id, student: sid, }, (err, result) => {
        if (err) {
            console.log(err)
            res.json("error");
        } else {
            res.json(result);
            console.log(result)
        }

    });
};

// Specific Student
exports.getStudentLessonScore = async(req, res) => {
    const studentEnrolledId = req.params.student_enrolled_id
    var finalValue = []

    try {
        // Need to return _id, lesson_name, finished_at, score
        console.log("Student Lesson Score")
        return res.json(finalValue)
        
    } catch (error) {
        return res.json([])
        
    }
}

exports.getStudentModuleScore = async(req, res) => {
    const studentEnrolledId = req.params.student_enrolled_id
    var finalValue = []

    try {
        // Need to return _id, module_name, finished_at, score
        console.log("Student Module Score")
        return res.json(finalValue)

    } catch (error) {
        return res.json([])
        
    }
}

// All Students in Classroom
exports.getStudentsLessonScore = async(req, res) => {
    const moduleLessonId = req.params.module_lesson_id
    var finalValue = []

    try {
        // Need to return _id, student_name, finished_at, score
        console.log("Students Lesson Score")
        return res.json(finalValue)

    } catch (error) {
        return res.json([])
        
    }
}

exports.getStudentsModuleScore = async(req, res) => {
    const moduleId = req.params.module_id
    var finalValue = []

    try {
        // Need to return _id, student_name, finished_at, score
        console.log("Students Module Score")
        return res.json(finalValue)

    } catch (error) {
        return res.json([])
        
    }
}