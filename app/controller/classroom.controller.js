const db = require("../models");
const Classroom = db.classroom;
var mongoose = require("mongoose");

exports.createClassroom = (req, res) => {
    var id = new mongoose.Types.ObjectId();
    const newData = new Classroom({_id: id})
    newData.save()
    res.json("Create Classroom");
    // console.log("Request Receive");
    // res.json([{
    //     id: "1",
    //     title: "Project Management App"
    // },
    // {
    //     id: "2",
    //     title: "Todo App"
    // }]);
};

// exports.getTestData = (req, res) => {
//     const testRef = firebase.database().ref('Test');
//     testRef.on("value", snapshot => {
//         const data = snapshot.val();
//         const dataList = [];
//         for (let id in data) {
//         dataList.push({ id, ...data[id] });
//         }
//         res.json(dataList)
//     });
// };

// exports.getUser = (req, res) => {
//     const usersRef = firebase.database().ref('Users').child(req.params.id);
//     usersRef.on("value", snapshot => {
//         res.json(snapshot.val())
//     });
    
// };

// exports.createTestData = (req, res) => {
//     const testRef = firebase.database().ref('Users');
//     testRef.push(req.body)
//     res.json("Successfully Created")
// };

// // exports.updateTestData = (req, res) => {
// //     const testRef = firebase.database().ref('Test').child(req.params.id);
// //     testRef.update(req.body)
// //     res.json("Successfully Updated")
// // };

// // exports.deleteTestData = (req, res) => {
// //     const testRef = firebase.database().ref('Test').child(req.params.id);
// //     testRef.remove()
// //     res.json("Successfully Deleted")
// // };