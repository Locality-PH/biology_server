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
    const classroomId = req.body["classroom_id"]
    var studentEnrolledId = ""

    Student.updateOne({_id: studentId}, {$pull: {classroom: classroomId}}, (err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            StudentEnrolled.findOne({students: studentId}, (err, result) => {
                if(err){
                    console.log(err)
                }
                else{
                    if(result != null){
                        studentEnrolledId = result._id
        
                        StudentEnrolled.deleteOne({students: studentId}, (err, result) =>{
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
}

exports.getClassroomModules = (req, res) =>{
    const classCode = req.params.class_code
    var finalValue = []

    Classroom.findOne({class_code: classCode}).populate("module").exec((err, result) =>{
        if(err){
            return res.json("Error")
        }
        else{
            if(result != null){
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

exports.getClassroomStudents = (req, res) =>{
    const classCode = req.params.class_code

    Classroom.findOne({class_code: classCode}).populate("student").exec((err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            res.json(result.student)
        }
    })
}
