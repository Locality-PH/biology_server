const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Teacher = db.teacher;
const Module = db.modules;
var mongoose = require("mongoose");

exports.createClassroom = (req, res) => {
    var moduleFinalVal = []
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

            moduleFinalVal.push({_id: module_id, 
                module_file: {file: result.data, filename: result.name, mimetype: result.mimetype}, 
                module_name: reqValues.modules_name[i], 
                quiz_link: reqValues.quizs_link[i]})

            moduleIds.push(module_id)
        })
    }else if(reqFiles != ""){
        const module_id = new mongoose.Types.ObjectId();

        moduleFinalVal.push({_id: module_id, 
            module_file: {file: reqFiles.data, filename: reqFiles.name, mimetype: reqFiles.mimetype}, 
            module_name: reqValues.modules_name[0], 
            quiz_link: reqValues.quizs_link[0]})

        moduleIds.push(module_id)
    }
    
    try {
        Module.insertMany(moduleFinalVal);
     } catch (e) {
        console.log(e);
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
                    description: reqValues.description,
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

    Classroom.findOne({_id: classroomId}, (err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            if(result != null){
                res.json(result.class_code)
            }else{
                res.json("Error")
            }
           
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

exports.getClassroomData = (req, res) => {
    const classCode = req.params.class_code

    Classroom.findOne({class_code: classCode}).populate("module").exec((err, result) =>{
        if(err){
            return res.json("Error")
        }
        else{
            if(result != null){
                return res.json(result)
            }else{
                return res.json("Error")
            }
        }
    })
}

exports.getClassroomModulesArray = (req, res) => {
    const classCode = req.params.class_code

    Classroom.findOne({class_code: classCode}, (err, result) =>{
        if(err){
            return res.json("Error")
        }
        else{
            if(result != null){
                return res.json(result.module)
            }else{
                return res.json("Error")
            }
        }
    })
}

exports.updateInitialModules = (req, res) => {
    const reqValues = JSON.parse(req.body.values)
    var reqFiles = ""

    try{
        reqFiles = req.files.file
    }
    catch(e){
        reqFiles = ""
    }

    // console.log(reqValues)
    // console.log(reqFiles)

    reqValues.delete_initial_modules.map(moduleId => {
        Classroom.updateOne({class_code: reqValues.class_code}, {$pull: {module: moduleId}}, (err, result) =>{
            if(err){
                return res.json("Error")
            }
            else{
                Module.deleteOne({_id: moduleId}, (err, result) => {
                    if(err){
                        return res.json("Error")
                    }
                    else{
                        // Deleted
                    }
                })
            }
        })
    })

    if(Array.isArray(reqFiles)){
            reqValues.nfl_initial_modules_id.map((moduleId, i) => {
                Module.updateOne({_id: moduleId}, {module_name: reqValues.nfl_initial_modules_name[i],
                    quiz_link: reqValues.nfl_initial_modules_link[i],
                    module_file: {file: reqFiles[i].data,
                    filename: reqFiles[i].name,
                    mimetype: reqFiles[i].mimetype}
                }, (err, result) => {
                    if(err){
                        return res.json("Error")
                    }
                    else{
                        // Deleted
                    }
                })
            })
    }else if(reqFiles != ""){
        reqValues.nfl_initial_modules_id.map((moduleId, i) => {
            Module.updateOne({_id: moduleId}, {module_name: reqValues.nfl_initial_modules_name[i],
                quiz_link: reqValues.nfl_initial_modules_link[i],
                module_file: {file: reqFiles.data,
                filename: reqFiles.name,
                mimetype: reqFiles.mimetype}
            }, (err, result) => {
                if(err){
                    return res.json("Error")
                }
                else{
                    // Deleted
                }
            })
        })
    }

    reqValues.nl_initial_modules_id.map((moduleId, i) => {
        Module.updateOne({_id: moduleId}, {module_name: reqValues.nl_initial_modules_name[i],
            quiz_link: reqValues.nl_initial_modules_link[i]
        }, (err, result) => {
            if(err){
                return res.json("Error")
            }
            else{
                // Deleted
            }
        })
    })
}

exports.updateClassroom = (req, res) => {
    var moduleFinalVal = []
    const reqValues = JSON.parse(req.body.values)
    var reqFiles = ""

    try{
        reqFiles = req.files.file
    }
    catch(e){
        reqFiles = ""
    }

    var classCode = req.params.class_code
    const moduleIds = []

    if(Array.isArray(reqFiles)){
        reqFiles.map((result, i) => {
            const module_id = new mongoose.Types.ObjectId();

            moduleFinalVal.push({_id: module_id, 
                module_file: {file: result.data, filename: result.name, mimetype: result.mimetype}, 
                module_name: reqValues.modules_name[i], 
                quiz_link: reqValues.quizs_link[i]})

            moduleIds.push(module_id)
        })
    }else if(reqFiles != ""){
        const module_id = new mongoose.Types.ObjectId();

        moduleFinalVal.push({_id: module_id, 
            module_file: {file: reqFiles.data, filename: reqFiles.name, mimetype: reqFiles.mimetype}, 
            module_name: reqValues.modules_name[0], 
            quiz_link: reqValues.quizs_link[0]})

        moduleIds.push(module_id)
    }
    
    try {
        Module.insertMany(moduleFinalVal);
        Classroom.updateOne({class_code: classCode}, {$push: { module: moduleIds}}, (err, result) =>{
            if(err){
                console.log(err)
            }
            else{
                
            }
        })
     } catch (e) {
        console.log(e);
     }
    
     Classroom.updateMany({class_code: classCode}, [{$set: {name: reqValues.name, 
        description: reqValues.description, 
        section_name: reqValues.section_name}}], (err, result) =>{
            if(err){
                console.log(err)
            }
            else{
                res.json("Updated")
            }
        })
};

exports.deleteClassroom = (req, res) => {
    const classroomId = req.body["classroom_id"]
    const userId = req.body["user_id"];
    var teacherId = ""
    var classroomModule = []

    Account.findOne({_id: userId}).populate("teacher").exec((err, result) =>{
        if(err){
            return res.json("Error")
        }
        else{
            teacherId = result.teacher._id

            if(teacherId != ""){
                Teacher.updateOne({_id: teacherId}, {$pull: {classroom: classroomId}}, (err, result) =>{
                    if(err){
                        return res.json("Error")
                    }
                    else{
                        Classroom.findOne({_id: classroomId}, (err, result) =>{
                            if(err){
                                return res.json("Error")
                            }
                            else{
                                classroomModule = result.module

                                if(classroomModule.length != 0){
                                    classroomModule.map(result => {
                                        Module.deleteOne({_id: result}, (err, result) => {
                                            if(err){
                                                console.log(err)
                                            }
                                            else{
                                            }
                                        })
                                    })
                                }

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
                })
            }
        }
    })
};

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

exports.getClassroomModules = (req, res) =>{
    const classCode = req.params.class_code

    Classroom.findOne({class_code: classCode}).populate("module").exec((err, result) =>{
        if(err){
            return res.json("Error")
        }
        else{
            if(result != null){
                return res.json(result.module)
            }else{
                return res.json("Error")
            }
        }
    })
}

exports.viewModule = (req, res) => {
    const moduleId = req.params.module_id

    Module.findOne({_id: moduleId}, (err, result) => {
        if(err)
        {
            console.log(err)
        }
        else
        {
            if(result != null){
                return res.end(result.module_file.file)
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

exports.deleteModule = (req, res) => {
    const moduleId = req.body["module_id"]
    const classCode = req.body["class_code"]

    Classroom.updateOne({class_code: classCode}, {$pull: {module: moduleId}}, (err, result) =>{
        if(err){
            return res.json("Error")
        }
        else{
            Module.deleteOne({_id: moduleId}, (err, result) => {
                if(err){
                    return res.json("Error")
                }
                else{
                    return res.json("Deleted")
                }
            })
        }
    })
}