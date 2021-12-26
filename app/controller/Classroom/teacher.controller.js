const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Teacher = db.teacher;
const Module = db.modules;
var mongoose = require("mongoose");

exports.createClassroom = (req, res) => {
    const reqValues = JSON.parse(req.body.values)
    var reqFiles = ""

    try{
        reqFiles = req.files.file
    }
    catch(e){
        reqFiles = ""
    }

    var classroomId = new mongoose.Types.ObjectId();
    const moduleIds = []
    const userId = reqValues.user_id
    var teacherId = ""

    if(Array.isArray(reqFiles)){
        reqFiles.map((result, i) => {
            const module_id = new mongoose.Types.ObjectId();
            const moduleData = new Module({_id: module_id, 
                module_file: {file: result.data, filename: result.name, mimetype: result.mimetype}, 
                module_name: reqValues.modules_name[i], 
                quiz_link: reqValues.quizs_link[i]})

            moduleIds.push(module_id)
            moduleData.save()
            
        })
    }else if(reqFiles != ""){
        const module_id = new mongoose.Types.ObjectId();
        const moduleData = new Module({_id: module_id, 
            module_file: {file: reqFiles.data, filename: reqFiles.name, mimetype: reqFiles.mimetype}, 
            module_name: reqValues.modules_name[0], 
            quiz_link: reqValues.quizs_link[0]})
        
        moduleIds.push(module_id)
        moduleData.save()
    }

    Account.findOne({_id: userId}).populate("teacher").exec((err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            teacherId = result.teacher._id

            if(teacherId != ""){
                const classroomData = new Classroom({_id: classroomId, 
                    name: reqValues.name, 
                    section_name: reqValues.section_name, module: moduleIds})
            
                Teacher.updateOne({_id: teacherId}, {$push: {classroom: [classroomData]}}, (err, result) =>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        classroomData.save()
                        res.json(classroomId.toString())
                    }
                })
            }
        }
    })
};

exports.getClassroomCode = (req, res) => {
    const classroomId = req.params.classroom_id

    Classroom.find({_id: classroomId}, (err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            res.json(result[0].class_code)
        }
    })
}

exports.downloadModule = (req, res) => {
    Module.find({_id: "61c80dc6dd11a225b0d512a3"}, (err, result) => {
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log( result[0].module_file.filename)
            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=" + result[0].module_name + ".pdf"
              });
            res.end(result[0].module_file.file)
        }
    })

}

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
                        return res.json(result.classroom)
                    }
                })
            }
        }
    })
};

exports.visitClassroom = (req, res) => {
    const class_code = req.params.class_code

    Classroom.find({class_code: class_code}, (err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            res.json(result[0])
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
