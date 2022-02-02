const db = require("../../models");
const Teacher = db.teacher;
const Classroom = db.classroom;
const Module = db.modules;
const AllModule = db.allmodules;
const Lesson = db.lessons;
const ModuleLesson = db.modulelessons
var mongoose = require("mongoose");
const e = require("express");

exports.getInitialModule = async (req, res) => {
    const moduleId = req.params.module_id
    var finalValue = {}

    try {
        const module = await AllModule.findOne({_id: moduleId})

        finalValue.module_name = module.name
        finalValue.name = module.topic_name
        finalValue.files = module.files.filename
        finalValue.whole_content = module.whole_content.filename
        finalValue.classwork_code = module.classwork_code
        finalValue.initial_lesson_ids = module.lesson

        const allModule = await AllModule.findOne({_id: moduleId}).populate("lesson")
        const lesson = allModule.lesson
        var lessonFilenames = []

        lesson.map(result => {
            lessonFilenames.push({
                _id: result._id,
                lesson_name: result.name,
                filename: result.files.filename,
                classwork_code: result.classwork_code
            })
        })

        finalValue.lessons_data =lessonFilenames
        return res.json(finalValue)
        
    } catch (e) {
        return res.json({})
    }
}

exports.createMyModule = async (req, res) => {
    const myModuleId = new mongoose.Types.ObjectId();

    const reqValues = JSON.parse(req.body.values)
    const teacherId = reqValues.teacher_id

    const file = req.files.file
    const wholeContent = req.files.whole_content

    const reqFiles = req.files.files

    const lessonIds = []
    var lessonFinalVal = []

    try{
        if (Array.isArray(reqFiles)) {
            reqFiles.map((result, i) => {
                const lessonId = new mongoose.Types.ObjectId();
    
                lessonFinalVal.push({
                    _id: lessonId,
                    name: reqValues.lesson_names[i],
                    files: { file: result.data, filename: result.name},
                    classwork_code: reqValues.lesson_classwork_codes[i]
                })
    
                lessonIds.push(lessonId)
            })
        } else if (reqFiles != "") {
            const lessonId = new mongoose.Types.ObjectId();
    
            lessonFinalVal.push({
                _id: lessonId,
                name: reqValues.lesson_names[0],
                files: { file: reqFiles.data, filename: reqFiles.name},
                classwork_code: reqValues.lesson_classwork_codes[0]
            })

            lessonIds.push(lessonId)
        }

        await Lesson.insertMany(lessonFinalVal);


    }catch(e){
        console.log("No Lesson")
    }

    try {
        const myModuleData = new AllModule({
            _id: myModuleId,
            name: reqValues.module_name,
            topic_name : reqValues.name,
            type: "MyModule",
            files: {
                file: file.data,
                filename: file.name
            },
            lesson: lessonIds,
            whole_content: {
                file: wholeContent.data,
                filename: wholeContent.name
            },
            classwork_code: reqValues.classwork_code
        })

        await myModuleData.save()
        await Teacher.updateOne({_id: teacherId }, {$push: {module: [myModuleData]}})

        return res.json("Success")


    } catch (e) {
        return res.json("Error")
    }
};

exports.getMyModules = async (req, res) => {
    const teacherId = req.params.teacher_id
    var finalValue = []

    Teacher.findOne({ _id: teacherId }).populate("module").exec((err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            if(result != null){
                result.module.map(result => {
                    finalValue.push({
                        _id: result._id,
                        module_name: result.name,
                        topic: result.topic_name,
                        lesson_count: result.lesson.length,
                        classwork_code: result.classwork_code
                    })
                })

                return res.json(finalValue)

            }else{
                return res.json(finalValue)
            }
        }
    })
    
}

exports.deleteMyModule = async (req, res) => {
    const teacherId = req.body.teacher_id
    const myModuleId = req.body._id

    try{
        const myModule = await AllModule.findOne({_id: myModuleId})
        const myModuleLesson = myModule.lesson

        await ModuleLesson.deleteMany({lesson_id: {$in: myModuleLesson}})
        await Lesson.deleteMany({_id: {$in: myModuleLesson}})
        const modules = await Module.find({module_id: myModuleId})
        var moduleIds = []
        modules.map(result => {
            moduleIds.push(result._id)
        })
        await Classroom.updateMany({}, {$pull:{module: {$in: moduleIds}}})
        // Delete Student Enrolled Finished Module
        await Module.deleteMany({module_id: myModuleId});
        await AllModule.deleteOne({_id: myModuleId})
        await Teacher.updateOne({ _id: teacherId }, { $pull: { module: myModuleId } })

        return res.json("Deleted")

    }catch(e){
        return res.json("Error")
    }
}

exports.updateMyModule = async (req, res) => {
    const reqValues = JSON.parse(req.body.values)

    try{

        await AllModule.updateOne({_id: reqValues.module_id}, 
            {
                name: reqValues.module_name, 
                topic_name: reqValues.name,
                classwork_code: reqValues.classwork_code
            })
        
        // Update initial lessons
        await reqValues.ncInitialLessonsId.map(async(id, i) => {
            await Lesson.updateOne({_id: id}, {
                name: reqValues.ncInitialLessonsName[i],
                classwork_code: reqValues.ncInitialLessonsClassworkCode[i]
            })
        })

        if(req.files != null){
            // Update initial lessons
            if(req.files.hasOwnProperty("update_lesson_file")){

            const reqFiles = req.files.update_lesson_file

            if (Array.isArray(reqFiles)) {
                await reqValues.nfcInitialLessonsId.map(async(id, i) => {
                    await Lesson.updateOne({_id: id}, {
                        name: reqValues.nfcInitialLessonsName[i],
                        classwork_code: reqValues.nfcInitialLessonsClassworkCode[i],
                        files: { file: reqFiles[i].data, filename: reqFiles[i].name},
                    })
                })
            } else if (reqFiles != "") {
                await reqValues.nfcInitialLessonsId.map(async(id, i) => {
                    await Lesson.updateOne({_id: id}, {
                        name: reqValues.nfcInitialLessonsName[i],
                        classwork_code: reqValues.nfcInitialLessonsClassworkCode[i],
                        files: { file: reqFiles.data, filename: reqFiles.name},
                    })
                })
    
            }

            }

        // Update File of introduction and whole_content
            if(req.files.hasOwnProperty("file")){
                await AllModule.updateOne({_id: reqValues.module_id}, 
                    {
                        files: {
                            file: req.files.file.data,
                            filename: req.files.file.name
                        }
                    })

            }

            if(req.files.hasOwnProperty("whole_content")){
                await AllModule.updateOne({_id: reqValues.module_id}, 
                    {
                        whole_content: {
                            file: req.files.whole_content.data,
                            filename: req.files.whole_content.name
                        }
                    })

            }

        // New Lesson
        const lessonIds = []
        var lessonFinalVal = []

        if(req.files.hasOwnProperty("files")){
            const reqFiles = req.files.files

            if (Array.isArray(reqFiles)) {
                reqFiles.map((result, i) => {
                    const lessonId = new mongoose.Types.ObjectId();
        
                    lessonFinalVal.push({
                        _id: lessonId,
                        name: reqValues.lesson_names[i],
                        files: { file: result.data, filename: result.name},
                        classwork_code: reqValues.lesson_classwork_codes[i]
                    })
        
                    lessonIds.push(lessonId)
                })
            } else if (reqFiles != "") {
                const lessonId = new mongoose.Types.ObjectId();
        
                lessonFinalVal.push({
                    _id: lessonId,
                    name: reqValues.lesson_names[0],
                    files: { file: reqFiles.data, filename: reqFiles.name},
                    classwork_code: reqValues.lesson_classwork_codes[0]
                })
    
                lessonIds.push(lessonId)
            }
    
            await Lesson.insertMany(lessonFinalVal);
            await AllModule.updateOne({_id: reqValues.module_id}, 
                {
                    $push: {lesson: lessonIds}
                })

        }
        }

        // Delete Initial Lesson
        await AllModule.updateOne({_id: reqValues.module_id}, {$pull: {lesson: {$in : reqValues.delete_lessons}}})
        await Lesson.deleteMany({_id: {$in: reqValues.delete_lessons}})

        return res.json("Updated")

    }catch(e){
        return res.json("Error")

    }

}

exports.createPresetModule = async (req, res) => {
    const presetModuleId = new mongoose.Types.ObjectId();

    const reqValues = JSON.parse(req.body.values)

    const file = req.files.file
    const wholeContent = req.files.whole_content

    const reqFiles = req.files.files

    const lessonIds = []
    var lessonFinalVal = []

    try{
        if (Array.isArray(reqFiles)) {
            reqFiles.map((result, i) => {
                const lessonId = new mongoose.Types.ObjectId();
    
                lessonFinalVal.push({
                    _id: lessonId,
                    name: reqValues.lesson_names[i],
                    files: { file: result.data, filename: result.name},
                    classwork_code: reqValues.lesson_classwork_codes[i]
                })
    
                lessonIds.push(lessonId)
            })
        } else if (reqFiles != "") {
            const lessonId = new mongoose.Types.ObjectId();
    
            lessonFinalVal.push({
                _id: lessonId,
                name: reqValues.lesson_names[0],
                files: { file: reqFiles.data, filename: reqFiles.name},
                classwork_code: reqValues.lesson_classwork_codes[0]
            })

            lessonIds.push(lessonId)
        }

        await Lesson.insertMany(lessonFinalVal);


    }catch(e){
        console.log("No Lesson")
    }

    try {
        const presetModuleData = new AllModule({
            _id: presetModuleId,
            name: reqValues.module_name,
            topic_name : reqValues.name,
            type: "PresetModule",
            files: {
                file: file.data,
                filename: file.name
            },
            lesson: lessonIds,
            whole_content: {
                file: wholeContent.data,
                filename: wholeContent.name
            },
            classwork_code: reqValues.classwork_code
        })

        await presetModuleData.save()

        return res.json("Success")


    } catch (e) {
        return res.json("Error")
    }
};

exports.getPresetModules = async (req, res) => {
    var finalValue = []

    AllModule.find({type: "PresetModule"}, (err, result) => {
        if(err){
            console.log(err)
        }else{
            if(result != null){
                result.map(result => {
                    finalValue.push({
                        _id: result._id,
                        module_name: result.name,
                        topic: result.topic_name,
                        lesson_count: result.lesson.length,
                        classwork_code: result.classwork_code
                    })
                })

                return res.json(finalValue)

            }else{
                return res.json(finalValue)

            }
        }
    })

}

exports.downloadPresetModule = async(req, res) => {
    const presetModuleId = req.params.preset_module_id
    
    const presetModule = await AllModule.findOne({_id: presetModuleId})
    const file = presetModule.whole_content.file
    const filename = presetModule.whole_content.filename

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=" + filename
    });
    res.end(file)
}

exports.deletePresetModule = async (req, res) => {
    const presetModuleId = req.body._id

    try{
        const presetModule = await AllModule.findOne({_id: presetModuleId})
        const presetModuleLesson = presetModule.lesson

        await ModuleLesson.deleteMany({lesson_id: {$in: presetModuleLesson}})
        await Lesson.deleteMany({_id: {$in: presetModuleLesson}})
        const modules = await Module.find({module_id: presetModuleId})
        var moduleIds = []
        modules.map(result => {
            moduleIds.push(result._id)
        })
        await Classroom.updateMany({}, {$pull:{module: {$in: moduleIds}}})
        // Delete Student Enrolled Finished Module
        await Module.deleteMany({module_id: presetModuleId});
        await AllModule.deleteOne({_id: presetModuleId})

        return res.json("Deleted")

    }catch(e){
        return res.json("Error")
    }
}

exports.updatePresetModule = async (req, res) => {
    const reqValues = JSON.parse(req.body.values)

    try{

        await AllModule.updateOne({_id: reqValues.module_id}, 
            {
                name: reqValues.module_name, 
                topic_name: reqValues.name,
                classwork_code: reqValues.classwork_code
            })
        
        // Update initial lessons
        await reqValues.ncInitialLessonsId.map(async(id, i) => {
            await Lesson.updateOne({_id: id}, {
                name: reqValues.ncInitialLessonsName[i],
                classwork_code: reqValues.ncInitialLessonsClassworkCode[i]
            })
        })

        if(req.files != null){
            // Update initial lessons
            if(req.files.hasOwnProperty("update_lesson_file")){

            const reqFiles = req.files.update_lesson_file

            if (Array.isArray(reqFiles)) {
                await reqValues.nfcInitialLessonsId.map(async(id, i) => {
                    await Lesson.updateOne({_id: id}, {
                        name: reqValues.nfcInitialLessonsName[i],
                        classwork_code: reqValues.nfcInitialLessonsClassworkCode[i],
                        files: { file: reqFiles[i].data, filename: reqFiles[i].name},
                    })
                })
            } else if (reqFiles != "") {
                await reqValues.nfcInitialLessonsId.map(async(id, i) => {
                    await Lesson.updateOne({_id: id}, {
                        name: reqValues.nfcInitialLessonsName[i],
                        classwork_code: reqValues.nfcInitialLessonsClassworkCode[i],
                        files: { file: reqFiles.data, filename: reqFiles.name},
                    })
                })
    
            }

            }

        // Update File of introduction and whole_content
            if(req.files.hasOwnProperty("file")){
                await AllModule.updateOne({_id: reqValues.module_id}, 
                    {
                        files: {
                            file: req.files.file.data,
                            filename: req.files.file.name
                        }
                    })

            }

            if(req.files.hasOwnProperty("whole_content")){
                await AllModule.updateOne({_id: reqValues.module_id}, 
                    {
                        whole_content: {
                            file: req.files.whole_content.data,
                            filename: req.files.whole_content.name
                        }
                    })

            }

        // New Lesson
        const lessonIds = []
        var lessonFinalVal = []

        if(req.files.hasOwnProperty("files")){
            const reqFiles = req.files.files

            if (Array.isArray(reqFiles)) {
                reqFiles.map((result, i) => {
                    const lessonId = new mongoose.Types.ObjectId();
        
                    lessonFinalVal.push({
                        _id: lessonId,
                        name: reqValues.lesson_names[i],
                        files: { file: result.data, filename: result.name},
                        classwork_code: reqValues.lesson_classwork_codes[i]
                    })
        
                    lessonIds.push(lessonId)
                })
            } else if (reqFiles != "") {
                const lessonId = new mongoose.Types.ObjectId();
        
                lessonFinalVal.push({
                    _id: lessonId,
                    name: reqValues.lesson_names[0],
                    files: { file: reqFiles.data, filename: reqFiles.name},
                    classwork_code: reqValues.lesson_classwork_codes[0]
                })
    
                lessonIds.push(lessonId)
            }
    
            await Lesson.insertMany(lessonFinalVal);
            await AllModule.updateOne({_id: reqValues.module_id}, 
                {
                    $push: {lesson: lessonIds}
                })

        }
        }

        // Delete Initial Lesson
        await AllModule.updateOne({_id: reqValues.module_id}, {$pull: {lesson: {$in : reqValues.delete_lessons}}})
        await Lesson.deleteMany({_id: {$in: reqValues.delete_lessons}})

        return res.json("Updated")

    }catch(e){
        return res.json("Error")

    }

}