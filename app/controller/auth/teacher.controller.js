const db = require("../../models");
var mongoose = require("mongoose");
const Teacher = db.teacher;
const Account = db.account;
const Classroom = db.classroom;

exports.updateTeacher = async (req, res) => {
    const userID = req.body.userID
    const teacherID = req.body.teacherID
    const newVals = req.body.values

    var classroom = []

    try {
        Teacher.findOne({_id: teacherID}, (err, result) => {
            if(err){
                console.log(err)
            }
            else{
                if(result != null){
                    classroom = result.classroom

                    Classroom.updateMany({_id: {$in: classroom}}, {$set: {teacher_name: newVals.full_name}}, (err, result) => {
                        if(err){
                            console.log(err)
                        }else{
                            Account.findByIdAndUpdate(
                                userID,
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