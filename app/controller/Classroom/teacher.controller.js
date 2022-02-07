const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Teacher = db.teacher;
const Module = db.modules;
const AllModule = db.allmodules;
const ModuleLesson = db.modulelessons
const Student = db.student
const StudentEnrolled = db.student_enrolled
const Classwork = db.classroom
const Scoreboard = db.scoreboard
var mongoose = require("mongoose");
const e = require("express");

exports.teacherDataCount = (req, res) =>{
    const teacherId = req.params.teacher_id

    var classroomsCount = 0
    var modulesCount = 0
    var quizsCount = 0
    var studentsCount = 0

    try {
        Teacher.findOne({ _id: teacherId }).populate("classroom").exec((err, result) => {
            if (err) {
                return res.json("Error")
            }
            else {
                if(result != null){
                    classroomsCount = result.classroom.length
                    modulesCount = result.module.length
                    quizsCount = result.classwork.length
    
                    result.classroom.map(result => {
                        studentsCount = studentsCount + result.student.length
                    })
                    
                    return res.json({
                        classrooms_count: classroomsCount,
                        modules_count: modulesCount,
                        quizs_count: quizsCount,
                        students_count: studentsCount
                    })
                }
                
            }
        })
    } catch (error) {
        return res.json({
            classrooms_count: classroomsCount,
            modules_count: modulesCount,
            quizs_count: quizsCount,
            students_count: studentsCount
        })
    }

}

exports.latestJoinedStudents = async(req, res) => {
    const teacherId = req.params.teacher_id
    var finalValue = []
    var limit = 5

    try {
        const teacher = await Teacher.findOne({_id: teacherId})
        const classroom = teacher.classroom
        const studentEnrolled = await 
        StudentEnrolled.find({classroom_id: {$in: classroom}}).sort({createdAt: -1}).limit(limit)
        var classroomIds = []

        if(studentEnrolled.length == 0){
            return res.json(finalValue)
        }

        studentEnrolled.map(result => {
            classroomIds.push(result.classroom_id)
        })

        const studentClassroom = await Classroom.find({_id: {$in: classroomIds}})

        studentEnrolled.map((result, i )=> {
            studentClassroom.filter(data => {
                if(data._id.toString() == result.classroom_id.toString()){
                    var date = new Date(result.createdAt)
                    finalValue.push({
                        _id: i,
                        student_name: result.student_name,
                        classroom_name: data.name,
                        joined_date: date.toDateString(),
                        joined_time: date.toLocaleTimeString()
                    })

                }
            })

            if(studentEnrolled.length == i + 1){
                return res.json(finalValue)
            }
        })

    } catch (error) {
        return res.json(finalValue)
    }
    
}

exports.createClassroom = async (req, res) => {
    const teacherId = req.body.teacher_id
    var classroomId = new mongoose.Types.ObjectId();

    var moduleFinalVal = []
    const moduleIds = []
    const modules = req.body.modules

    try {
        var allModuleIds = []
        var lessonFinalVal = []
        
        modules.map(modules => {
            allModuleIds.push(modules._id)
        })

        const allModule = await AllModule.find({_id: {$in: allModuleIds}})
        var allModuleLesson = []

        for(var i = 0; i < allModuleIds.length; i++){
            for(j = 0; j < allModuleIds.length; j++){
                if(allModule[j]._id.toString() == allModuleIds[i]){
                    allModuleLesson.push(allModule[j].lesson)

                    var lessonIds = []

                    allModuleLesson[i].map(lessonId => {
                        const lesson_id = new mongoose.Types.ObjectId();
                        lessonFinalVal.push({
                            _id: lesson_id,
                            lesson_id: lessonId
                        })

                        lessonIds.push(lesson_id)
                    })

                    const module_id = new mongoose.Types.ObjectId();

                    moduleFinalVal.push({
                        _id: module_id,
                        module_id: allModuleIds[i],
                        lessons: lessonIds
                    })

                    moduleIds.push(module_id)
                }
            }
        }
        
        await ModuleLesson.insertMany(lessonFinalVal)
        await Module.insertMany(moduleFinalVal);

        const classroomData = new Classroom({
            _id: classroomId,
            name: req.body.name,
            teacher_name: req.body.teacher_name,
            description: req.body.description,
            section_name: req.body.section_name, 
            module: moduleIds
        })

        await classroomData.save()
        await Teacher.updateOne({_id: teacherId }, {$push: { classroom: [classroomData] }})

        return res.json(classroomId.toString())

    } catch (e) {
        console.log(e);
    }
};

exports.getTeacherFullName = (req, res) => {
    const teacherId = req.params.teacher_id

    Account.findOne({ teacher: teacherId }, (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            if (result != null) {
                return res.json(result.full_name)
            } else {
                return res.json("Error")
            }

        }
    })

}

exports.getClassroomCode = async(req, res) => {
    const classroomId = req.params.classroom_id

    try {
        const classroom = await Classroom.findOne({ _id: classroomId })
        return res.json(classroom.class_code)
        
    } catch (error) {
        return res.json("Error")
    }
}

exports.getClassrooms = (req, res) => {
    const teacherId = req.params.teacher_id

    Teacher.findOne({ _id: teacherId }).populate("classroom").exec((err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.json(result.classroom)
        }
    })
};

exports.getClassroomData = async(req, res) => {
    const classCode = req.params.class_code
    var finalValue = {
        name: "",
        section_name: "",
        description: "",
        modules: [],
        all_module_ids: []
    }

    try{
        const classroom = await Classroom.findOne({class_code: classCode}).populate("module")
        finalValue.name = classroom.name
        finalValue.section_name = classroom.section_name
        finalValue.description = classroom.description
        const module = classroom.module

        var allModuleIds = []
        var moduleIds = []

        module.map(result => {
            moduleIds.push(result._id)
            allModuleIds.push(result.module_id)
        })

        finalValue.all_module_ids = allModuleIds

        const allModule = await AllModule.find({_id: {$in: allModuleIds}}).sort({$natural: 1})
        var tempValue = []

        allModule.map((result, i)=> {
            tempValue.push({
            _id: result._id,
            type: result.type,
            topic: result.topic_name,
            module_name: result.name,
            lesson_count: result.lesson.length
        }
        )

        })

        for(var i = 0; i < allModuleIds.length; i++){
            for(var j = 0; j < tempValue.length; j++){
                if(allModuleIds[i] == tempValue[j]._id.toString()){
                    finalValue.modules.push(tempValue[j])
                }

            }
        }

        return res.json(finalValue)

    }catch(e){
        return res.json(finalValue)

    }

}

exports.getMyModules = async (req, res) => {
    const teacherId = req.params.teacher_id
    const classCode = req.params.class_code
    var finalValue = []

    try {
        const teacher = await Teacher.findOne({ _id: teacherId }).populate("module")
        const module = teacher.module

        const classroom = await Classroom.findOne({class_code: classCode}).populate("module")
        const classroomModules = classroom.module

        module.map(result => {
            var checked = false

            classroomModules.filter(data => {
                if(data.module_id.toString() == result._id){
                    checked = true
                }
            })

            finalValue.push({
                _id: result._id,
                module_name: result.name,
                topic: result.topic_name,
                lesson_count: result.lesson.length,
                classwork_code: result.classwork_code,
                checked: checked
            })
        })

        return res.json(finalValue)
        
    } catch (error) {
        return res.json(finalValue)
    }
}

exports.getPresetModules = async (req, res) => {
    var finalValue = []
    const classCode = req.params.class_code

    try {
        const allModule = await AllModule.find({type: "PresetModule"})

        const classroom = await Classroom.findOne({class_code: classCode}).populate("module")
        const classroomModules = classroom.module

        allModule.map(result => {
            var checked = false

            classroomModules.filter(data => {
                if(data.module_id.toString() == result._id){
                    checked = true
                }
            })
            
            finalValue.push({
                _id: result._id,
                module_name: result.name,
                topic: result.topic_name,
                lesson_count: result.lesson.length,
                classwork_code: result.classwork_code,
                checked: checked
            })

        })

        return res.json(finalValue)
        
    } catch (error) {
        return res.json(finalValue)
        
    }
}

exports.updateClassroom = async(req, res) => {
    const classCode = req.body.class_code

    try {
        await Classroom.updateOne({class_code: classCode}, 
            {name: req.body.name,
            section_name: req.body.section_name,
        description: req.body.description})

        if(req.body.modules_is_editable == true){
            const classroom = await Classroom.findOne({class_code: classCode})
            const classroomModules = classroom.module

            var lessonIds = []

            const module = await Module.find({_id: {$in: classroomModules}})
            await Module.deleteMany({_id: {$in : classroomModules}})
            // Delete Student Enrolled Finished Module

            module.map(module => {
                lessonIds.push(...module.lessons)
            })
            
            await ModuleLesson.deleteMany({_id: {$in: lessonIds}})

            var moduleFinalVal = []
            const moduleIds = []
            const modules = req.body.modules

            if(modules.length == 0){
                await Classroom.updateOne({class_code: classCode}, {module: []})
                return res.json("Updated")
            }

            var allModuleIds = []
            var lessonFinalVal = []
            
            modules.map(modules => {
                allModuleIds.push(modules._id)
            })

            const allModule = await AllModule.find({_id: {$in: allModuleIds}})
            var allModuleLesson = []

            for(var i = 0; i < allModuleIds.length; i++){
                for(j = 0; j < allModuleIds.length; j++){
                    if(allModule[j]._id.toString() == allModuleIds[i]){
                        allModuleLesson.push(allModule[j].lesson)

                        var lessonIds = []

                        allModuleLesson[i].map(lessonId => {
                            const lesson_id = new mongoose.Types.ObjectId();
                            lessonFinalVal.push({
                                _id: lesson_id,
                                lesson_id: lessonId
                            })

                            lessonIds.push(lesson_id)
                        })

                        const module_id = new mongoose.Types.ObjectId();

                        moduleFinalVal.push({
                            _id: module_id,
                            module_id: allModuleIds[i],
                            lessons: lessonIds
                        })

                        moduleIds.push(module_id)
                    }
                }
            }
            
            await ModuleLesson.insertMany(lessonFinalVal)
            await Module.insertMany(moduleFinalVal);

            await Classroom.updateOne({class_code: classCode}, {module: moduleIds})
            return res.json("Updated")
        }else{
            return res.json("Updated")
        }
        
    } catch (error) {
        return res.json("Error")
    }
    
};

exports.deleteClassroom = async(req, res) => {
    const classroomId = req.body.classroom_id
    const teacherId = req.body.teacher_id

    try {
        await Teacher.updateOne({ _id: teacherId }, { $pull: { classroom: classroomId } })
        const classroom = await Classroom.findOne({ _id: classroomId })
        const classroomModules = classroom.module
        const classroomStudents = classroom.student

        await Classroom.deleteOne({_id: classroomId})

        var lessonIds = []

        const module = await Module.find({_id: {$in: classroomModules}})
        await Module.deleteMany({_id: {$in: classroomModules}})

        module.map(module => {
            lessonIds.push(...module.lessons)
        })
        
        await ModuleLesson.deleteMany({_id: {$in: lessonIds}})

        const studentEnrolled = await StudentEnrolled.find({_id: classroomStudents})
        var studentsIds = []

        studentEnrolled.map(studentEnrolled => {
            studentsIds.push(studentEnrolled.students)
        })

        await Student.updateMany({ _id: {$in: studentsIds} }, { $pull: { classroom: classroomId } })
        await StudentEnrolled.deleteMany({_id : {$in: classroomStudents}})
        res.json("Deleted")
        
    } catch (error) {
        return res.json("Error")
    }
};

exports.getClassroomStudents = (req, res) => {
    const classCode = req.params.class_code

    Classroom.findOne({ class_code: classCode }).populate("student").exec((err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json(result.student)
        }
    })
}

exports.deleteStudent = async(req, res) => {
    const studentId = req.body.student_id
    const classCode = req.body.class_code
    var classroomId = ""
    var studentEnrolledId = ""
    var moduleFinish = []
    var lessonFinish = []

    try {
        const classroom = await Classroom.findOne({class_code: classCode})
        classroomId = classroom._id
        const studentEnrolled = await StudentEnrolled.findOne({students: studentId, classroom_id: classroomId})
        moduleFinish = studentEnrolled.module_finish
        lessonFinish = studentEnrolled.lesson_finish
        studentEnrolledId = studentEnrolled._id

        await Classroom.updateOne({class_code: classCode}, {$pull: {student: studentEnrolledId}})
        await StudentEnrolled.deleteOne({_id: studentEnrolledId})
        await Module.updateMany({_id: {$in: moduleFinish}}, {$pull: {finished: studentEnrolledId}})
        await ModuleLesson.updateMany({_id: {$in: lessonFinish}}, {$pull: {finished: studentEnrolledId}})

        await Student.updateOne({_id: studentId}, {$pull: {classroom: classroomId}})
        return res.json("Deleted")
        
    } catch (error) {
        return res.json("Error")
        
    }

}

exports.getStudentModuleFinished = (req, res) => {
    const studentEnrolledId = req.params.student_enrolled_id
    var studentId = ""
    var finalValue = []

    StudentEnrolled.findOne({_id: studentEnrolledId}).populate("module_finish").exec((err, result) =>{
        if(err){
            return res.json("Error")
        }
        else{
            if(result != null){
                studentId = result.students
                var moduleFinished = result.module_finish

                if(moduleFinished.length == 0){
                    return res.json(finalValue)
                }

                moduleFinished.map((finished, i) => {
                    var quizLink = finished.quiz_link

                    Classwork.findOne({quiz_link: quizLink}, (err, result) => {
                        if(err){
                            console.log(err)
                        }else{
                            if(result != null){
                                var quizId = result._id
    
                                Scoreboard.findOne({student: studentId, quiz: quizId}, (err, result) => {
                                    if(err){
                                        console.log(err)
                                    }
                                    else{
                                        if(result != null){
                                            var date = new Date(result.createdAt)

                                            finalValue.push({
                                                _id: i,
                                                module_name: finished.module_name,
                                                finished_at: date.toDateString() + ", " + date.toLocaleTimeString(),
                                                quiz_score: result.score + "/" + result.max_score
                                            })

                                          
                                        }else{
                                            finalValue.push({
                                                _id: i,
                                                module_name: finished.module_name,
                                                finished_at: "None",
                                                quiz_score: "None"
                                            })
                                        }

                                        if(moduleFinished.length == i + 1){
                                            return res.json(finalValue)
                                        }
                                    }
                                })
                            }else{
                                finalValue.push({
                                    _id: i,
                                    module_name: finished.module_name,
                                    finished_at: "None",
                                    quiz_score: "None"
                                })

                                if(moduleFinished.length == i + 1){
                                    return res.json(finalValue)
                                }

                            }
    
                        }
                    })


                })

            }else{
                return res.json(finalValue)
            }
        }
    })
}

exports.getClassroomModules = async (req, res) =>{
    const classCode = req.params.class_code
    var finalValue = []

    try{
        const classroom = await Classroom.findOne({class_code: classCode}).populate("module")
        const module = classroom.module

        var allModuleIds = []
        var moduleIds = []
        var finished = []

        module.map(result => {
            moduleIds.push(result._id)
            allModuleIds.push(result.module_id)
            finished.push(result.finished.length)
        })

        const allModule = await AllModule.find({_id: {$in: allModuleIds}}).sort({$natural: 1})
        var tempValue = []

        allModule.map((result, i)=> {
            tempValue.push({
            module_id: result._id,
            type: result.type,
            module_name: result.name,
            classwork_code: result.classwork_code,
            lesson_count: result.lesson.length
        }
        )

        })

        for(var i = 0; i < allModuleIds.length; i++){
            for(var j = 0; j < tempValue.length; j++){
                if(allModuleIds[i] == tempValue[j].module_id.toString()){
                    tempValue[j]._id = moduleIds[i]
                    tempValue[j].finished = finished[i]

                    finalValue.push(tempValue[j])
                }

            }
        }

        return res.json(finalValue)

    }catch(e){
        return res.json(finalValue)

    }

}

exports.deleteModule = async (req, res) => {
    const moduleId = req.body.module_id
    const classCode = req.body.class_code

    var classroomId = ""
    var moduleFinish = []

    try {
        const classroom = await Classroom.findOne({class_code: classCode })
        
        const classroomStudents = classroom.student
        await StudentEnrolled.updateMany({_id: {$in: classroomStudents}}, {$pull: {module_finish: moduleId}})

        await Classroom.updateOne({class_code: classCode}, {$pull: {module: moduleId}})

        const module = await Module.findOne({_id: moduleId})
        const lessons = module.lessons

        await Module.deleteOne({_id: moduleId})
        await ModuleLesson.deleteMany({_id: {$in: lessons}})

        return res.json("Deleted")
        
    } catch (error) {
        return res.json("Error")
    }
}
