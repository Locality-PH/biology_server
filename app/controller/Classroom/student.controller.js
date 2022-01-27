const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Teacher = db.teacher;
const Module = db.modules;
const Student = db.student
const StudentEnrolled = db.student_enrolled
var mongoose = require("mongoose");

exports.joinClassroom = (req, res) => {
    const studentEnrolledId = new mongoose.Types.ObjectId();
    const studentId = req.body["student_id"]
    const classCode = req.body["class_code"]
    const studentName = req.body["student_name"]
    var classroomId = ""

    Classroom.findOne({class_code: classCode}, (err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            if(result != null){
                classroomId = result._id

                Student.findOne({_id: studentId}, (err, result) => {
                    if(err){
                        console.log(err)
                    }
                    else{
                        if(result.classroom.indexOf(classroomId) == -1){
                            const studentEnrolledData = new StudentEnrolled({_id: studentEnrolledId,
                                classroom_id: classroomId,
                                student_name: studentName, 
                                students: studentId})
            
                            Student.updateOne({_id: studentId}, {$push: {classroom: [classroomId]}}, (err, result) =>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    
                                }
                            })
            
                            Classroom.updateOne({class_code: classCode}, {$push: {student: [studentEnrolledData]}}, (err, result) =>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    studentEnrolledData.save()
                                    return res.json("Successfully join the classroom")
                                }
                            })
                        }
                        else{
                            return res.json("You already join this classroom")
                        }
                    }
                })

               
            }else{
                return res.json("Error")
            }
           
        }
    })

};

exports.getStudentAccount = (req, res) => {
    const uid = req.params.uid;
    console.log(uid);
  
    try {
      Account.findById(uid, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          console.log(result);
          res.json(result);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

exports.updateStudent = async (req, res) => {
    const uid = req.body.uid
    const sid = req.body.sid
    const newVals = req.body.values

    try {
        Student.findOne({_id: sid}, (err, result) => {
            if(err){
                console.log(err)
            }
            else{
                if(result != null){

                    StudentEnrolled.updateMany({students: {$in: sid}}, {$set: {student_name: newVals.full_name}}, (err, result) => {
                        if(err){
                            console.log(err)
                        }else{
                            Account.findByIdAndUpdate(
                                uid,
                                {
                                    full_name: newVals.full_name,
                                }, (err, result) => {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        res.json(result)
                                    }
                                }
                            )

                        }
                    })

                }
            }
        })

    } catch (error) {
        console.log(error)
    }
};

exports.getStudentFullName = (req, res) => {
    const studentId = req.params.student_id

    Account.findOne({student: studentId}, (err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            if(result != null){
                return res.json(result.full_name)
            }else{
                return res.json("Error")
            }
           
        }
    })

}

exports.getClassrooms = (req, res) =>{
    const studentId = req.params.student_id;

    Student.findOne({_id: studentId}).populate("classroom").exec((err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            res.json(result.classroom)
        }
    })

}

exports.unEnrol = (req, res) => {
    const studentId = req.body["student_id"]
    const classCode = req.body["class_code"]
    var classroomId = ""
    var studentEnrolledId = ""
    var moduleFinish = []

    Classroom.findOne({class_code: classCode}, (err, result) =>{
        if(err){
            return res.json("Error")
        }
        else{
            if(result != null){
                classroomId = result._id

                Student.updateOne({_id: studentId}, {$pull: {classroom: classroomId.toString()}}, (err, result) =>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        StudentEnrolled.findOne({classroom_id: classroomId, students: studentId}, (err, result) => {
                            if(err){
                                console.log(err)
                            }
                            else{
                                if(result != null){
                                    studentEnrolledId = result._id
                                    moduleFinish = result.module_finish
            
                                    moduleFinish.map(id => {
                                        Module.updateOne({_id: id}, {$pull: {finished: studentEnrolledId.toString()}}, (err, result) =>{
                                            if(err){
                                                console.log(err)
                                            }
                                            else{
            
                                            }
                                        })
            
                                    })
                    
                                    StudentEnrolled.deleteOne({_id: studentEnrolledId}, (err, result) =>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                        }
                                    })
                    
                                    Classroom.updateOne({_id: classroomId}, {$pull: {student: studentEnrolledId}}, (err, result) =>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            res.json("Unenrol")
                                        }
                                    })
                                }
                            }
                        })
                   
                    }
                })

            }else{
                return res.json("Error")
            }
        }
    })
}

exports.getClassroomModules = (req, res) =>{
    const classCode = req.params.class_code
    const studentId = req.params.student_id
    var classroomId = ""
    var module = []
    var moduleFinish = []
    var finalValue = []

    Classroom.findOne({class_code: classCode}).populate("module").exec((err, result) =>{
        if(err){
            return res.json("Error")
        }
        else{
            if(result != null){
                classroomId = result._id
                module = result.module

                StudentEnrolled.findOne({classroom_id: classroomId, students: studentId}, (err, result) => {
                    if(err){
                        return res.json("Error")
                    }
                    else{
                        if(result != null){
                            moduleFinish = result.module_finish

                            module.map((result, i) => {
                                if(moduleFinish.indexOf(result._id) != -1){
                                    finalValue.push({
                                        _id: result._id,
                                        module_file: {
                                            filename: result.module_file.filename
                                        },
                                        module_name: result.module_name,
                                        quiz_link: result.quiz_link,
                                        finish: true,
                                        disabled: false
                                    })
                                }
                                else if(i != 0){
                                    if(finalValue[i - 1].finish == true){
                                        finalValue.push({
                                            _id: result._id,
                                            module_file: {
                                                filename: result.module_file.filename
                                            },
                                            module_name: result.module_name,
                                            quiz_link: result.quiz_link,
                                            finish: false,
                                            disabled: false
                                        })
                                    }
                                    else{
                                        finalValue.push({
                                            _id: result._id,
                                            module_file: {
                                                filename: result.module_file.filename
                                            },
                                            module_name: result.module_name,
                                            quiz_link: result.quiz_link,
                                            finish: false,
                                            disabled: true
                                        })
                                    }
                                }
                                else if(i == 0){
                                    finalValue.push({
                                        _id: result._id,
                                        module_file: {
                                            filename: result.module_file.filename
                                        },
                                        module_name: result.module_name,
                                        quiz_link: result.quiz_link,
                                        finish: false,
                                        disabled: false
                                    })
                                }
                               
                            })

                            return res.json(finalValue)
                        }
                    }
                    
                })
            }else{
                return res.json("Error")
            }
        }
    })
}

exports.getModule = (req, res) =>{
    const moduleId = req.params.module_id

    Module.findOne({_id: moduleId}, (err, result) =>{
        if(err){
            return res.json("Error")
        }
        else{
            if(result != null){
                return res.json(result.module_file.file)
            }else{
                return res.json("Error")
            }
        }
    })
}

exports.downloadModule = (req, res) => {
    const moduleId = req.params.module_id
    
    Module.findOne({_id: moduleId}, (err, result) => {
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log( result.module_file.filename)
            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=" + result.module_file.filename
              });
            res.end(result.module_file.file)
        }
    })

}

exports.moduleFinish = (req, res) => {
    const studentId = req.body["student_id"]
    const classCode = req.body["class_code"]
    const moduleId = req.body["module_id"]
    var studentEnrolledId = ""
    var classroomId = ""

    Classroom.findOne({class_code: classCode}, (err, result) =>{
        if(err){
            return res.json("Error")
        }
        else{
            if(result != null){
                classroomId = result._id

                StudentEnrolled.findOne({classroom_id: classroomId, students: studentId}, (err, result) =>{
                    if(err){
                        return res.json("Error")
                    }
                    else{
                        if(result != null){
                            studentEnrolledId = result._id

                            StudentEnrolled.updateOne({_id: studentEnrolledId}, {$push: {module_finish: [moduleId]}}, (err, result) =>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                }
                            })

                            Module.updateOne({_id: moduleId}, {$push: {finished: [studentEnrolledId]}}, (err, result) =>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    res.json("Module Finish")
                                }
                            })
                            
                        }else{
                            return res.json("Error")
                        }
                    }
                })
                
            }else{
                return res.json("Error")
            }
        }
    })
}

exports.moduleUnFinish = (req, res) => {
    const studentId = req.body["student_id"]
    const classCode = req.body["class_code"]
    const moduleId = req.body["module_id"]
    var studentEnrolledId = ""
    var classroomId = ""

    Classroom.findOne({class_code: classCode}, (err, result) =>{
        if(err){
            return res.json("Error")
        }
        else{
            if(result != null){
                classroomId = result._id

                StudentEnrolled.findOne({classroom_id: classroomId, students: studentId}, (err, result) =>{
                    if(err){
                        return res.json("Error")
                    }
                    else{
                        if(result != null){
                            studentEnrolledId = result._id

                            StudentEnrolled.updateOne({_id: studentEnrolledId}, {$pull: {module_finish: moduleId}}, (err, result) =>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                             
                                }
                            })

                            Module.updateOne({_id: moduleId}, {$pull: {finished: studentEnrolledId.toString()}}, (err, result) =>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    res.json("Module UnFinish")

                                }
                            })
                        }else{
                            return res.json("Error")
                        }
                    }
                })
                
            }else{
                return res.json("Error")
            }
        }
    })
}

exports.getClassroomTeacherFullname = (req, res) =>{
    const classCode = req.params.class_code

    Classroom.findOne({class_code: classCode}, (err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            if(result != null){
                res.json(result.teacher_name)
            }
        }
    })
}

exports.getClassroomStudents = (req, res) =>{
    const classCode = req.params.class_code
    var finalValue = []

    Classroom.findOne({class_code: classCode}).populate("student").exec((err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            if(result != null){
                result.student.map((result, i) => {
                    finalValue.push({
                        _id: i,
                        student_name: result.student_name
                    }
                    )
                })

                res.json(finalValue)
            }
        }
    })
}
