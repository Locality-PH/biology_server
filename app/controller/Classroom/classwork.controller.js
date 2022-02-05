const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Module = db.modules;
const StudentEnrolled = db.student_enrolled
const Student = db.student;
const Teacher = db.teacher;
const Classwork = db.classwork;
const ModuleLesson = db.modulelessons
var mongoose = require("mongoose");


exports.createClasswork = async (req, res) => {

    const tid = req.body.tid
    const cin = (req.body.question_index)
    const img_files = (req.files)
    var newClasswork = JSON.parse(req.body.newClasswork)
    var newClassworkId = new mongoose.Types.ObjectId();
    newClasswork["_id"] = newClassworkId

    console.log(cin)
    console.log(img_files)

    if (typeof cin == "string") {
        var tcin = JSON.parse(cin)
        console.log(tcin)

        if (tcin.isNewFile == true) {
            var img_file = img_files[`question${tcin.index + 1}_image`]
            console.log(img_file)
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

    console.log(newClasswork)

    try {
        const newClassworkData = new Classwork(newClasswork)
        await newClassworkData.save()
        console.log(newClassworkId)
        await Teacher.updateOne({ _id: tid }, { $push: { classwork: [newClassworkId] } })
    } catch (e) {
        console.log(e);
    }

    res.json("Classwork created successfully")

};

exports.getClasswork = async (req, res) => {
    var Cid = req.params.Cid
    console.log(Cid)

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
    var teacher = await Teacher.findById(tid).populate("classwork");
    let isClassworkValid = false

    teacher.classwork.map((classwork) => {
        if (classwork.classwork_link == classwork_code) {
            isClassworkValid = true
        }
    })

    if (isClassworkValid) {
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

    Teacher.findOne({ _id: tid }).populate("classwork").exec((err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.json(result.classwork)
        }
    })

};

exports.updateClasswork = async (req, res) => {
    console.log(req.files)
    console.log(req.body)

    const cin = (req.body.question_index)
    const cid = (req.body.classwork_id)
    const img_files = (req.files)

    var newClasswork = JSON.parse(req.body.newClasswork)
    var oldClasswork = await Classwork.findById(cid)

    console.log(newClasswork)
    console.log(typeof cin == "string")

    if (typeof cin == "string") {
        var tcin = JSON.parse(cin)
        console.log(tcin)

        if (tcin.isNewFile == false) {
            var oq = oldClasswork.question
            newClasswork.question[tcin.index].img = oq[tcin.index].img
        }

        else if (tcin.isNewFile == true) {
            var img_file = img_files[`question${tcin.index + 1}_image`]
            console.log(img_file)
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

    console.log(newClasswork)

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

    console.log(req.body)

    const tid = req.body.tid
    const Cid = req.body.Cid

    Teacher.updateOne({ _id: tid }, { $pull: { classwork: Cid } }, (err, result) => {
        if (err) {
            return res.json("Error")
        }
        else {
            Classwork.deleteOne({ _id: Cid }, (err, result) => {
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

exports.uploadImage = async (req, res) => {

    console.log(req.files)
    console.log(req.body)

    console.log("test", req.files.question4_image)


};
