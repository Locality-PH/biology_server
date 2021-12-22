const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Teacher = db.teacher;
var mongoose = require("mongoose");

exports.createClassroom = (req, res) => {
    var id = new mongoose.Types.ObjectId();
    const userId = req.body["user_id"]
    var teacherId = ""

    Account.findOne({_id: userId}).populate("teacher").exec((err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            teacherId = result.teacher._id

            if(teacherId != ""){
                const classroomData = new Classroom({_id: id, 
                    name: req.body["name"], 
                    section_name: req.body["section_name"]})
            
                Teacher.updateOne({_id: teacherId}, {$push: {classroom: [classroomData]}}, (err, result) =>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        classroomData.save()
                        return res.json(result)
                    }
                })
            }
        }
    })

};

exports.getClassrooms = (req, res) => {
    const userId = req.params.user_id;
    var teacherId = ""

    Account.findOne({_id: userId}).populate("teacher").exec((err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            teacherId = result.teacher._id

            if(teacherId != ""){
                Teacher.findOne({_id: teacherId}).populate("classroom").exec((err, result) =>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        return res.json(result)
                    }
                })
            }
        }
    })
};

exports.visitClassroom = (req, res) => {
    const classroomId = req.params.classroom_id

    Classroom.find({_id: classroomId}, (err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            res.json(result)
        }
    })
};

exports.updateClassroom = (req, res) => {
};

exports.deleteClassroom = (req, res) => {
    const classroomId = req.body["classroom_id"]
    const userId = req.body["user_id"];
    var teacherId = ""

    Account.findOne({_id: userId}).populate("teacher").exec((err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            teacherId = result.teacher._id

            if(teacherId != ""){
                Teacher.updateOne({_id: teacherId}, {$pull: {classroom: classroomId}}, (err, result) =>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        Classroom.deleteOne({_id: classroomId}, (err, result) => {
                            if(err){
                                console.log(err)
                            }
                            else{
                                res.json("Deleted")
                            }
                        })
                    }
                })
            }
        }
    })

    
};
