const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Student = db.student;
const StudentEnrolled = db.student_enrolled;
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

