const db = require("../../models");
var mongoose = require("mongoose");
const Teacher = db.teacher;

exports.updateTeacher = async (req, res) => {
    console.log("attempting to update user from: " + req.body.values.first_name);
};

exports.getTeacher = (req, res) => {
    const teacherID = req.params.teacherID
    console.log(teacherID)
 try {

    Teacher.findById(teacherID, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    }).populate('classroom')
 } catch (error) {
     console.log(error)
 }
};