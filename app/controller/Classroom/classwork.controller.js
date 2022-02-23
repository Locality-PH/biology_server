const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Module = db.modules;
const StudentEnrolled = db.student_enrolled
const Student = db.student;
const Teacher = db.teacher;
const Classwork = db.classwork;
const ModuleLesson = db.modulelessons
const Lesson = db.lessons
const AllModule = db.allmodules
var mongoose = require("mongoose");


exports.createClasswork = async (req, res) => {

    const tid = req.body.tid
    const cin = (req.body.question_index)
    const img_files = (req.files)
    var newClasswork = JSON.parse(req.body.newClasswork)
    var newClassworkId = new mongoose.Types.ObjectId();
    newClasswork["_id"] = newClassworkId
    newClasswork["type"] = "private"

    if (typeof cin == "string") {
        var tcin = JSON.parse(cin)
        // console.log(tcin)

        if (tcin.isNewFile == true) {
            var img_file = img_files[`question${tcin.index + 1}_image`]
            // console.log(img_file)
            newClasswork.question[tcin.index].img = { file: img_file.data, filename: img_file.name }
        }
    }

    else if (Array.isArray(cin)) {
        cin.map((cin, i) => {
            var tcin = JSON.parse(cin)

            if (tcin.isNewFile == true) {
                var img_file = img_files[`question${tcin.index + 1}_image`]

                newClasswork.question[tcin.index]._id = new mongoose.Types.ObjectId()
                newClasswork.question[tcin.index].img = { file: img_file.data, filename: img_file.name }
            }
        })
    }

    // console.log(newClasswork)

    try {
        const newClassworkData = new Classwork(newClasswork)
        await newClassworkData.save()
        // console.log(newClassworkId)
        await Teacher.updateOne({ _id: tid }, { $push: { classwork: [newClassworkId] } })
    } catch (e) {
        console.log(e);
    }

    res.json("Classwork created successfully")

};

exports.getClasswork = async (req, res) => {
    var Cid = req.params.Cid
    // console.log(Cid)

    try {
        Classwork.findById(Cid, (err, result) => {
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

exports.getTeacherClassworkByCode = async (req, res) => {
    var classwork_code = req.params.classwork_code
    var tid = req.body.tid

    try {
        var teacher = await Teacher.findById(tid).populate("classwork");
        var classwork = await Classwork.findOne({ classwork_link: classwork_code })
        let isClassworkValid = false

        if (classwork == null) {
            res.json("failed")
        }

    } catch (error) {
        console.log(error)
        res.json("failed")
    }


    if (classwork.type == "public") {
        isClassworkValid = true
    } 
    
    else {
        teacher.classwork.map((classwork) => {
            if (classwork.classwork_link == classwork_code) {
                isClassworkValid = true
            }
        })
    }

    if (isClassworkValid) {
        try {
            res.json(classwork)
        } catch (error) {
            console.log(error)
        }
    } else {
        res.json("failed")
    }

};

exports.getStudentClassworkByCode = async (req, res) => {
    var classwork_code = req.params.classwork_code
    var ct = req.body.ct
    var sid = req.body.sid
    var cc = req.body.class_code
    var mal_id = req.body.mal_id
    let isStudentValid = false

    var student = await Student.findById(sid).populate("classroom");
    var classroom = await Classroom.findOne({ class_code: cc })
    var cid = classroom._id

    var isEnrolled = await StudentEnrolled.findOne({ classroom_id: cid, students: sid })

    if (ct == "quiz") {
        var isModuleValid = await Module.findOne({ _id: mal_id }).populate("module_id")
        isModuleValid = isModuleValid.module_id.classwork_code

        if (isEnrolled != null && isModuleValid == classwork_code) {
            isStudentValid = true
        }
    }

    if (ct == "activity") {
        var isLessonValid = await ModuleLesson.findOne({ _id: mal_id }).populate("lesson_id")
        isLessonValid = isLessonValid.lesson_id.classwork_code

        if (isEnrolled != null && isLessonValid == classwork_code) {
            isStudentValid = true
        }
    }


    if (isStudentValid) {
        try {
            Classwork.findOne({ classwork_link: classwork_code }, (err, result) => {
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
        console.log("Failed")
    }


};

exports.getAllClasswork = async (req, res) => {

    const tid = req.params.tid

    try {
        const teacher = await Teacher.findOne({ _id: tid }).populate({ path: 'classwork', options: { sort: { updatedAt: -1 } } })
        const teacher_classworks = teacher.classwork
        res.json(teacher_classworks)
    } catch (error) {
       console.log(error)
    }

};

exports.updateClasswork = async (req, res) => {

    const cin = (req.body.question_index)
    const cid = (req.body.classwork_id)
    const img_files = (req.files)

    var newClasswork = JSON.parse(req.body.newClasswork)
    var oldClasswork = await Classwork.findById(cid)

    if (typeof cin == "string") {
        var tcin = JSON.parse(cin)

        if (tcin.isNewFile == false) {
            var oq = oldClasswork.question
            newClasswork.question[tcin.index].img = oq[tcin.index].img
        }

        else if (tcin.isNewFile == true) {
            var img_file = img_files[`question${tcin.index + 1}_image`]
            newClasswork.question[tcin.index].img = { file: img_file.data, filename: img_file.name }
        }
    }

    else if (Array.isArray(cin)) {
        cin.map((cin, i) => {
            var tcin = JSON.parse(cin)

            if (tcin.isNewFile == false) {
                var oq = oldClasswork.question
                newClasswork.question[tcin.index].img = oq[tcin.index].img
            }

            else if (tcin.isNewFile == true) {
                var img_file = img_files[`question${tcin.index + 1}_image`]

                newClasswork.question[tcin.index]._id = new mongoose.Types.ObjectId()
                newClasswork.question[tcin.index].img = { file: img_file.data, filename: img_file.name }
            }
        })
    }

    try {
        Classwork.updateOne({ _id: cid }, newClasswork, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                res.json("Update Success")
            }
        })
    } catch (e) {
        console.log(e);
    }

}

exports.deleteClasswork = async (req, res) => {

    const tid = req.body.tid // teacher_id
    const cid = req.body.cid //classwork_id
    const cc = req.body.cc //classwork_code

    try {
        await Teacher.updateOne({ _id: tid }, { $pull: { classwork: cid } })
        await Classwork.deleteOne({ _id: cid })
        await AllModule.updateMany({classwork_code: cc}, {$unset: {classwork_code: null }})
        await Lesson.updateMany({classwork_code: cc}, {$unset: {classwork_code: null }})
    } catch (error) {
        console.log(error)
        res.json("Error")
    }

    res.json("Deleted")


};

exports.uploadImage = async (req, res) => {

    // console.log(req.files)
    // console.log(req.body)

    // console.log("test", req.files.question4_image)

};
