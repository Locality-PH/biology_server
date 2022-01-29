const db = require("../../models");
const Teacher = db.teacher;
const Module = db.modules;
const MyModule = db.mymodules;
const PresetModule = db.presetmodules;
const Lesson = db.lessons;
var mongoose = require("mongoose");
const e = require("express");

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
        const myModuleData = new MyModule({
            _id: myModuleId,
            name: reqValues.module_name,
            files: {
                name : reqValues.name,
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

        Teacher.updateOne({ _id: teacherId }, { $push: { module: [myModuleData] } }, (err, result) => {
            if (err) {
                return res.json("Error")
            }
            else {
                return res.json("Success")
            }
        })

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
                        topic: result.files.name,
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
        const myModule = await MyModule.findOne({_id: myModuleId})
        const myModuleLesson = myModule.lesson

        await Lesson.deleteMany({_id: {$in: myModuleLesson}})
        await Module.deleteMany({module_id: myModuleId});
        await MyModule.deleteOne({_id: myModuleId})
        await Teacher.updateOne({ _id: teacherId }, { $pull: { module: myModuleId } })

        return res.json("Deleted")

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
        const presetModuleData = new PresetModule({
            _id: presetModuleId,
            name: reqValues.module_name,
            files: {
                name : reqValues.name,
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

    PresetModule.find({}, (err, result) => {
        if(err){
            console.log(err)
        }else{
            if(result != null){
                result.map(result => {
                    finalValue.push({
                        _id: result._id,
                        module_name: result.name,
                        topic: result.files.name,
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

exports.deletePresetModule = async (req, res) => {
    const presetModuleId = req.body._id

    try{
        const presetModule = await PresetModule.findOne({_id: presetModuleId})
        const presetModuleLesson = presetModule.lesson

        await Lesson.deleteMany({_id: {$in: presetModuleLesson}})
        await Module.deleteMany({module_id: presetModuleId});
        await PresetModule.deleteOne({_id: presetModuleId})

        return res.json("Deleted")

    }catch(e){
        return res.json("Error")
    }
}