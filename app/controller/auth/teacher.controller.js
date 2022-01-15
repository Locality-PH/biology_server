const db = require("../../models");
var mongoose = require("mongoose");
const Teacher = db.teacher;
const Account = db.account;

exports.updateTeacher = async (req, res) => {
    const userID = req.body.userID
    const teacherID = req.body.teacherID
    const newVals = req.body.values

    try {
        Teacher.findByIdAndUpdate(
            teacherID,
            {
                first_name: newVals.first_name,
                last_name: newVals.last_name,
            }, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    res.json(result)
                }
            }
        )
    } catch (error) {
        console.log(error)
    }

    // try {
    //     Account.findByIdAndUpdate(
    //         userID,
    //         {
    //             email: newVals.email,
    //         }, (err, result) => {
    //             if (err) {
    //                 console.log(err)
    //             } else {
    //                 res.json(result)
    //             }
    //         }
    //     )
    // } catch (error) {
    //     console.log(error)
    // }
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