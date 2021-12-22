const db = require("../../models");
const Classroom = db.classroom;
const Teacher = db.teacher;
var mongoose = require("mongoose");

exports.createClassroom = (req, res) => {
    var id = new mongoose.Types.ObjectId();
    const userID = req.body["user_id"]

    const classroomData = new Classroom({_id: id, 
        name: req.body["name"], 
        section_name: req.body["section_name"]})

    Teacher.updateOne({_id: userID}, {$push: {classroom: [classroomData]}}, (err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            classroomData.save()
            res.json(result)
        }
    })
};

exports.getClassrooms = (req, res) => {
    const userId = req.params.user_id;
    
    Teacher.findOne({_id: userId}).populate("classroom").exec((err, result) =>{
        res.json(result)
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

    Teacher.updateOne({_id: req.body["user_id"]}, {$pull: {classroom: classroomId}}, (err, result) =>{
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
};
