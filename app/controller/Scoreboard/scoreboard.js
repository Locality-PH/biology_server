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
    var classwork_code = newData.classwork_code

    var new_id = new mongoose.Types.ObjectId();
    var sid = mongoose.Types.ObjectId(newData.student_id);

    var classroom = await Classroom.findOne({ class_code: cc })
    var cid = classroom._id

    var newScoreboardData = {
        _id: new_id,
        answer_list: newData.answer_list,
        score_list: newData.score_list,
        max_score: newData.max_score,
        score: newData.score,
        student: sid,
        mal_id,
        classwork_code
    }

    const newScoreboard = new Scoreboard(newScoreboardData)
    await newScoreboard.save()

    var student_enrolled = await StudentEnrolled.findOne({ students: sid, classroom_id: cid })
    var student_enrolled_id = student_enrolled._id

    if (ct == "activity") {
        await StudentEnrolled.updateOne({ students: sid, classroom_id: cid }, { $push: { lesson_finish: [mal_id] } })
        await ModuleLesson.updateOne({ _id: mal_id }, { $push: { finished: [student_enrolled_id] } })
    }

    if (ct == "quiz") {
        await StudentEnrolled.updateOne({ students: sid, classroom_id: cid }, { $push: { module_finish: [mal_id] } })
        await Module.updateOne({ _id: mal_id }, { $push: { finished: [student_enrolled_id] } })
    }

    res.json(newScoreboardData)
    // console.log(newScoreboardData)


};

exports.updateStudentScore = async (req, res) => {

    console.log(req.body)
    const score_list = req.body.score_list
    const score = req.body.score
    const sb_id = req.body.scoreboard_id

    await Scoreboard.findByIdAndUpdate(sb_id, { $set: { score_list, score }})


};

exports.validateStudent = async (req, res) => {
    // console.log(req.body)

    var sid = req.body.sid // student_id
    var mal_id = req.body.mal_id
    var cc = req.body.cc

    Scoreboard.findOne({ mal_id: mal_id, student: sid, classwork_code: cc }, (err, result) => {
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
exports.getStudentLessonScore = async (req, res) => {
    const studentEnrolledId = req.params.student_enrolled_id
    var finalValue = []

    try {
        const studentEnrolled = await StudentEnrolled.findOne({ _id: studentEnrolledId }).populate(
            {
                path: 'lesson_finish',
                populate:
                    { path: 'lesson_id' }
            })

        const studentId = studentEnrolled.students
        var lessonFinishIds = []

        studentEnrolled.lesson_finish.map(lessonFinishData => {
            lessonFinishIds.push(lessonFinishData._id)
            finalValue.push(
                {
                    mal_id: lessonFinishData._id,
                    lesson_name: lessonFinishData.lesson_id.name,
                    student_id: studentId
                }
            )
        })

        const scoreboard = await Scoreboard.find({ mal_id: { $in: lessonFinishIds }, student: studentId })

        scoreboard.map((scoreboardData, i) => {
            var date = new Date(scoreboardData.createdAt)

            finalValue[i].finished_at = date.toDateString() + ", " + date.toLocaleTimeString()
            finalValue[i].score = scoreboardData.score + "/" + scoreboardData.max_score
            finalValue[i].classwork_code = scoreboardData.classwork_code
        })

        return res.json(finalValue)

    } catch (error) {
        return res.json([])

    }
}

exports.getStudentModuleScore = async (req, res) => {
    const studentEnrolledId = req.params.student_enrolled_id
    var finalValue = []

    try {
        const studentEnrolled = await StudentEnrolled.findOne({ _id: studentEnrolledId }).populate(
            {
                path: 'module_finish',
                populate:
                    { path: 'module_id' }
            })

        const studentId = studentEnrolled.students
        var moduleFinishIds = []

        studentEnrolled.module_finish.map(moduleFinishData => {
            moduleFinishIds.push(moduleFinishData._id)
            finalValue.push(
                {
                    mal_id: moduleFinishData._id,
                    module_name: moduleFinishData.module_id.name,
                    student_id: studentId
                }
            )
        })

        const scoreboard = await Scoreboard.find({ mal_id: { $in: moduleFinishIds }, student: studentId })

        scoreboard.map((scoreboardData, i) => {
            var date = new Date(scoreboardData.createdAt)

            finalValue[i].finished_at = date.toDateString() + ", " + date.toLocaleTimeString()
            finalValue[i].score = scoreboardData.score + "/" + scoreboardData.max_score
            finalValue[i].classwork_code = scoreboardData.classwork_code
        })

        return res.json(finalValue)

    } catch (error) {
        return res.json([])

    }
}

// All Students in Classroom
exports.getStudentsLessonScore = async (req, res) => {
    const moduleLessonId = req.params.module_lesson_id
    var finalValue = []

    try {
        const moduleLesson = await ModuleLesson.findOne({ _id: moduleLessonId }).populate("finished")

        var studentIds = []

        moduleLesson.finished.map(moduleLessonData => {
            studentIds.push(moduleLessonData.students)
            finalValue.push({
                _id: moduleLessonData._id,
                student_name: moduleLessonData.student_name,
                student_id: moduleLessonData.students

            })
        })

        const scoreboard = await Scoreboard.find({ mal_id: moduleLessonId, student: { $in: studentIds } })

        scoreboard.map((scoreboardData, i) => {
            var date = new Date(scoreboardData.createdAt)
            finalValue[i].finished_at = date.toDateString() + ", " + date.toLocaleTimeString()
            finalValue[i].score = scoreboardData.score + "/" + scoreboardData.max_score
            finalValue[i].classwork_code = scoreboardData.classwork_code
        })

        return res.json(finalValue)

    } catch (error) {
        return res.json([])

    }
}

exports.getStudentsModuleScore = async (req, res) => {
    const moduleId = req.params.module_id
    var finalValue = []

    try {
        const module = await Module.findOne({ _id: moduleId }).populate("finished")

        var studentIds = []

        module.finished.map(moduleData => {
            studentIds.push(moduleData.students)
            finalValue.push({
                _id: moduleData._id,
                student_name: moduleData.student_name,
                student_id: moduleData.students
            })
        })

        const scoreboard = await Scoreboard.find({ mal_id: moduleId, student: { $in: studentIds } })

        scoreboard.map((scoreboardData, i) => {
            var date = new Date(scoreboardData.createdAt)
            finalValue[i].finished_at = date.toDateString() + ", " + date.toLocaleTimeString()
            finalValue[i].score = scoreboardData.score + "/" + scoreboardData.max_score
            finalValue[i].classwork_code = scoreboardData.classwork_code
        })

        return res.json(finalValue)

    } catch (error) {
        return res.json([])

    }
}