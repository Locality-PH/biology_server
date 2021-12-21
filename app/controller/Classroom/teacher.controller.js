const db = require("../../models");
const Classroom = db.classroom;
const Teacher = db.teacher;
var mongoose = require("mongoose");

exports.createClassroom = (req, res) => {
    var id = new mongoose.Types.ObjectId();

    const classroomData = new Classroom({_id: id, 
        name: req.body["name"], 
        section_name: req.body["section_name"]})

    Teacher.updateOne({_id: req.body["id"]}, {$push: {classroom: [classroomData]}},(err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            classroomData.save()
            res.json(result)
        }
    })
};

exports.getClassroom = (req, res) => {
    res.json({test: "Data"})
};

exports.updateClassroom = (req, res) => {
    res.json({test: "Data"})
};

exports.deleteClassroom = (req, res) => {
};
