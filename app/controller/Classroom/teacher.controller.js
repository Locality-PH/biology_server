const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Teacher = db.teacher;
const Module = db.modules;
const Student = db.student
const StudentEnrolled = db.student_enrolled
var mongoose = require("mongoose");

exports.createClassroom = (req, res) => {
    var moduleFinalVal = []
    const reqValues = JSON.parse(req.body.values)
    var reqFiles = ""

    try {
        reqFiles = req.files.file
    }
    catch (e) {
        reqFiles = ""
    }

    var classroomId = new mongoose.Types.ObjectId();
    const moduleIds = []
    const teacherId = reqValues.teacher_id

    if (Array.isArray(reqFiles)) {
        reqFiles.map((result, i) => {
            const module_id = new mongoose.Types.ObjectId();

            moduleFinalVal.push({
                _id: module_id,
                module_file: { file: result.data, filename: result.name, mimetype: result.mimetype },
                module_name: reqValues.modules_name[i],
                quiz_link: reqValues.quizs_link[i]
            })

            moduleIds.push(module_id)
        })
    } else if (reqFiles != "") {
        const module_id = new mongoose.Types.ObjectId();

        moduleFinalVal.push({
            _id: module_id,
            module_file: { file: reqFiles.data, filename: reqFiles.name, mimetype: reqFiles.mimetype },
            module_name: reqValues.modules_name[0],
            quiz_link: reqValues.quizs_link[0]
        })

        moduleIds.push(module_id)
    }

    try {
        Module.insertMany(moduleFinalVal);

        const classroomData = new Classroom({
            _id: classroomId,
            name: reqValues.name,
            teacher_name: reqValues.teacher_name,
            description: reqValues.description,
            section_name: reqValues.section_name, module: moduleIds
        })

        classroomData.save()

        Teacher.updateOne({ _id: teacherId }, { $push: { classroom: [classroomData] } }, (err, result) => {
            if (err) {
                console.log(err)
            }
            else {
                return res.json(classroomId.toString())
            }
        })
    } catch (e) {
        console.log(e);
    }
};

exports.getTeacherFullName = (req, res) => {
    const teacherId = req.params.teacher_id

    Account.findOne({ teacher: teacherId }, (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            if (result != null) {
                return res.json(result.full_name)
            } else {
                return res.json("Error")
            }

        }
    })

}

exports.getClassroomCode = (req, res) => {
    const classroomId = req.params.classroom_id

    Classroom.findOne({ _id: classroomId }, (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            if (result != null) {
                res.json(result.class_code)
            } else {
                res.json("Error")
            }

        }
    })
}

exports.getClassrooms = (req, res) => {
    const teacherId = req.params.teacher_id

    Teacher.findOne({ _id: teacherId }).populate("classroom").exec((err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.json(result.classroom)
        }
    })
};

exports.getClassroomData = (req, res) => {
    const classCode = req.params.class_code

    Classroom.findOne({ class_code: classCode }).populate("module").exec((err, result) => {
        if (err) {
            return res.json("Error")
        }
        else {
            if (result != null) {
                return res.json(result)
            } else {
                return res.json("Error")
            }
        }
    })
}

exports.getClassroomModulesArray = (req, res) => {
    const classCode = req.params.class_code

    Classroom.findOne({ class_code: classCode }, (err, result) => {
        if (err) {
            return res.json("Error")
        }
        else {
            if (result != null) {
                return res.json(result.module)
            } else {
                return res.json("Error")
            }
        }
    })
}

exports.updateInitialModules = (req, res) => {
    const reqValues = JSON.parse(req.body.values)
    var reqFiles = ""

    try {
        reqFiles = req.files.file
    }
    catch (e) {
        reqFiles = ""
    }

    // console.log(reqValues)
    // console.log(reqFiles)

    reqValues.delete_initial_modules.map(moduleId => {
        Classroom.updateOne({ class_code: reqValues.class_code }, { $pull: { module: moduleId } }, (err, result) => {
            if (err) {
                return res.json("Error")
            }
            else {
                Module.deleteOne({ _id: moduleId }, (err, result) => {
                    if (err) {
                        return res.json("Error")
                    }
                    else {
                        // Deleted
                    }
                })
            }
        })
    })

    if (Array.isArray(reqFiles)) {
        reqValues.nfl_initial_modules_id.map((moduleId, i) => {
            Module.updateOne({ _id: moduleId }, {
                module_name: reqValues.nfl_initial_modules_name[i],
                quiz_link: reqValues.nfl_initial_modules_link[i],
                module_file: {
                    file: reqFiles[i].data,
                    filename: reqFiles[i].name,
                    mimetype: reqFiles[i].mimetype
                }
            }, (err, result) => {
                if (err) {
                    return res.json("Error")
                }
                else {
                    // Deleted
                }
            })
        })
    } else if (reqFiles != "") {
        reqValues.nfl_initial_modules_id.map((moduleId, i) => {
            Module.updateOne({ _id: moduleId }, {
                module_name: reqValues.nfl_initial_modules_name[i],
                quiz_link: reqValues.nfl_initial_modules_link[i],
                module_file: {
                    file: reqFiles.data,
                    filename: reqFiles.name,
                    mimetype: reqFiles.mimetype
                }
            }, (err, result) => {
                if (err) {
                    return res.json("Error")
                }
                else {
                    // Deleted
                }
            })
        })
    }

    reqValues.nl_initial_modules_id.map((moduleId, i) => {
        Module.updateOne({ _id: moduleId }, {
            module_name: reqValues.nl_initial_modules_name[i],
            quiz_link: reqValues.nl_initial_modules_link[i]
        }, (err, result) => {
            if (err) {
                return res.json("Error")
            }
            else {
                // Deleted
            }
        })
    })
}

exports.updateClassroom = (req, res) => {
    var moduleFinalVal = []
    const reqValues = JSON.parse(req.body.values)
    var reqFiles = ""

    try {
        reqFiles = req.files.file
    }
    catch (e) {
        reqFiles = ""
    }

    var classCode = req.params.class_code
    const moduleIds = []

    if (Array.isArray(reqFiles)) {
        reqFiles.map((result, i) => {
            const module_id = new mongoose.Types.ObjectId();

            moduleFinalVal.push({
                _id: module_id,
                module_file: { file: result.data, filename: result.name, mimetype: result.mimetype },
                module_name: reqValues.modules_name[i],
                quiz_link: reqValues.quizs_link[i]
            })

            moduleIds.push(module_id)
        })
    } else if (reqFiles != "") {
        const module_id = new mongoose.Types.ObjectId();

        moduleFinalVal.push({
            _id: module_id,
            module_file: { file: reqFiles.data, filename: reqFiles.name, mimetype: reqFiles.mimetype },
            module_name: reqValues.modules_name[0],
            quiz_link: reqValues.quizs_link[0]
        })

        moduleIds.push(module_id)
    }

    try {
        Module.insertMany(moduleFinalVal);
        Classroom.updateOne({ class_code: classCode }, { $push: { module: moduleIds } }, (err, result) => {
            if (err) {
                console.log(err)
            }
            else {

            }
        })
    } catch (e) {
        console.log(e);
    }

    Classroom.updateMany({ class_code: classCode }, [{
        $set: {
            name: reqValues.name,
            description: reqValues.description,
            section_name: reqValues.section_name
        }
    }], (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json("Updated")
        }
    })
};

exports.deleteClassroom = (req, res) => {
    const classroomId = req.body["classroom_id"]
    const teacherId = req.body["teacher_id"]
    var classroomModules = []
    var classroomStudents = []

    Teacher.updateOne({ _id: teacherId }, { $pull: { classroom: classroomId } }, (err, result) => {
        if (err) {
            return res.json("Error")
        }
        else {
            Classroom.findOne({ _id: classroomId }, (err, result) => {
                if (err) {
                    return res.json("Error")
                }
                else {
                    classroomModules = result.module
                    classroomStudents = result.student

                    if (classroomModules.length != 0) {
                        classroomModules.map(id => {
                            Module.deleteOne({ _id: id }, (err, result) => {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                }
                            })
                        })
                    }

                    if (classroomStudents.length != 0) {
                        classroomStudents.map(id => {
                            StudentEnrolled.findOne({ _id: id }, (err, result) => {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    if (result != null) {
                                        Student.updateOne({ _id: result.students.toString() }, { $pull: { classroom: classroomId } }, (err, result) => {
                                            if (err) {
                                                console.log(err)
                                            }
                                            else {
                                                StudentEnrolled.deleteOne({ _id: id }, (err, result) => {
                                                    if (err) {
                                                        console.log(err)
                                                    }
                                                    else {

                                                    }
                                                })
                                            }
                                        })
                                    }
                                }

                            })


                        })
                    }

                    Classroom.deleteOne({ _id: classroomId }, (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            res.json("Deleted")
                        }
                    })
                }
            })
        }
    })
};

exports.getClassroomStudents = (req, res) => {
    const classCode = req.params.class_code

    Classroom.findOne({ class_code: classCode }).populate("student").exec((err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json(result.student)
        }
    })
}

exports.deleteStudent = (req, res) => {
    const studentId = req.body["student_id"]
    const studentEnrolledId = req.body["student_enrolled_id"]
    const classCode = req.body["class_code"]
    var classroomId = ""

    Classroom.findOne({ class_code: classCode }, (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            if (result != null) {
                classroomId = result._id

                Student.updateOne({ _id: studentId }, { $pull: { classroom: classroomId.toString() } }, (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        StudentEnrolled.deleteOne({ students: studentId }, (err, result) => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                            }
                        })
                    }
                })

                Classroom.updateOne({ _id: classroomId }, { $pull: { student: studentEnrolledId } }, (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        res.json("Deleted")
                    }
                })
            }


        }
    })

}

exports.getClassroomModules = (req, res) => {
    const classCode = req.params.class_code
    var finalValue = []

    Classroom.findOne({ class_code: classCode }).populate("module").exec((err, result) => {
        if (err) {
            return res.json("Error")
        }
        else {
            if (result != null) {
                result.module.map(result => {
                    finalValue.push({
                        _id: result._id,
                        module_file: {
                            filename: result.module_file.filename,
                            mimetype: result.module_file.mimetype
                        },
                        module_name: result.module_name,
                        quiz_link: result.quiz_link,
                        finished: result.finished
                    })

                })

                return res.json(finalValue)
            } else {
                return res.json("Error")
            }
        }
    })
}

exports.viewModule = (req, res) => {
    const moduleId = req.params.module_id

    Module.findOne({ _id: moduleId }, (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            if (result != null) {
                return res.end(result.module_file.file)
            } else {
                return res.json("Error")
            }
        }
    })

}

exports.getModule = (req, res) => {
    const moduleId = req.params.module_id

    Module.findOne({ _id: moduleId }, (err, result) => {
        if (err) {
            return res.json("Error")
        }
        else {
            if (result != null) {
                return res.json(result.module_file.file)
            } else {
                return res.json("Error")
            }
        }
    })
}

exports.downloadModule = (req, res) => {
    const moduleId = req.params.module_id

    Module.findOne({ _id: moduleId }, (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(result.module_file.filename)
            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=" + result.module_file.filename
            });
            res.end(result.module_file.file)
        }
    })

}

exports.deleteModule = (req, res) => {
    const moduleId = req.body["module_id"]
    const classCode = req.body["class_code"]

    Classroom.updateOne({ class_code: classCode }, { $pull: { module: moduleId } }, (err, result) => {
        if (err) {
            return res.json("Error")
        }
        else {
            Module.deleteOne({ _id: moduleId }, (err, result) => {
                if (err) {
                    return res.json("Error")
                }
                else {
                    return res.json("Deleted")
                }
            })
        }
    })
}