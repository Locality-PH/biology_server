const db = require("../../models");
const Account = db.account;
const Classroom = db.classroom;
const Teacher = db.teacher;
const Module = db.modules;
const AllModule = db.allmodules;
const Lesson = db.lessons;
const ModuleLesson = db.modulelessons
const Student = db.student
const StudentEnrolled = db.student_enrolled
var mongoose = require("mongoose");

exports.joinClassroom = (req, res) => {
    const studentEnrolledId = new mongoose.Types.ObjectId();
    const studentId = req.body["student_id"]
    const classCode = req.body["class_code"]
    const studentName = req.body["student_name"]
    var classroomId = ""

    Classroom.findOne({class_code: classCode}, (err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            if(result != null){
                classroomId = result._id

                Student.findOne({_id: studentId}, (err, result) => {
                    if(err){
                        console.log(err)
                    }
                    else{
                        if(result.classroom.indexOf(classroomId) == -1){
                            const studentEnrolledData = new StudentEnrolled({_id: studentEnrolledId,
                                classroom_id: classroomId,
                                student_name: studentName, 
                                students: studentId})
            
                            Student.updateOne({_id: studentId}, {$push: {classroom: [classroomId]}}, (err, result) =>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    
                                }
                            })
            
                            Classroom.updateOne({class_code: classCode}, {$push: {student: [studentEnrolledData]}}, (err, result) =>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    studentEnrolledData.save()
                                    return res.json("Successfully join the classroom")
                                }
                            })
                        }
                        else{
                            return res.json("You already join this classroom")
                        }
                    }
                })

               
            }else{
                return res.json("Error")
            }
           
        }
    })

};

exports.getStudentAccount = (req, res) => {
    const uid = req.params.uid;
    console.log(uid);
  
    try {
      Account.findById(uid, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          console.log(result);
          res.json(result);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

exports.updateStudent = async (req, res) => {
    const uid = req.body.uid
    const sid = req.body.sid
    const newVals = req.body.values

    try {
        Student.findOne({_id: sid}, (err, result) => {
            if(err){
                console.log(err)
            }
            else{
                if(result != null){

                    StudentEnrolled.updateMany({students: {$in: sid}}, {$set: {student_name: newVals.full_name}}, (err, result) => {
                        if(err){
                            console.log(err)
                        }else{
                            Account.findByIdAndUpdate(
                                uid,
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

exports.getStudentFullName = (req, res) => {
    const studentId = req.params.student_id

    Account.findOne({student: studentId}, (err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            if(result != null){
                return res.json(result.full_name)
            }else{
                return res.json("Error")
            }
           
        }
    })

}

exports.getClassrooms = (req, res) =>{
    const studentId = req.params.student_id;

    Student.findOne({_id: studentId}).populate("classroom").exec((err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            res.json(result.classroom)
        }
    })

}

exports.unEnrol = (req, res) => {
    const studentId = req.body["student_id"]
    const classCode = req.body["class_code"]
    var classroomId = ""
    var studentEnrolledId = ""
    var moduleFinish = []

    Classroom.findOne({class_code: classCode}, (err, result) =>{
        if(err){
            return res.json("Error")
        }
        else{
            if(result != null){
                classroomId = result._id

                Student.updateOne({_id: studentId}, {$pull: {classroom: classroomId.toString()}}, (err, result) =>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        StudentEnrolled.findOne({classroom_id: classroomId, students: studentId}, (err, result) => {
                            if(err){
                                console.log(err)
                            }
                            else{
                                if(result != null){
                                    studentEnrolledId = result._id
                                    moduleFinish = result.module_finish
            
                                    moduleFinish.map(id => {
                                        Module.updateOne({_id: id}, {$pull: {finished: studentEnrolledId.toString()}}, (err, result) =>{
                                            if(err){
                                                console.log(err)
                                            }
                                            else{
            
                                            }
                                        })
            
                                    })
                    
                                    StudentEnrolled.deleteOne({_id: studentEnrolledId}, (err, result) =>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                        }
                                    })
                    
                                    Classroom.updateOne({_id: classroomId}, {$pull: {student: studentEnrolledId}}, (err, result) =>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            res.json("Unenrol")
                                        }
                                    })
                                }
                            }
                        })
                   
                    }
                })

            }else{
                return res.json("Error")
            }
        }
    })
}

exports.getClassroomModules = async(req, res) =>{
    const classCode = req.params.class_code
    const studentId = req.params.student_id

    var finalValue = []

    try {
        const classroom = await Classroom.findOne({class_code: classCode}).populate(
            {path: 'module',
                populate: 
                    {path: 'lessons', 
                        populate: 
                            {path: "lesson_id"}}})

        const classroomId = classroom._id
        const studentEnrolled = await StudentEnrolled.findOne({students: studentId, classroom_id: classroomId})
        const studentEnrolledId = studentEnrolled._id
        
        const module = classroom.module

        module.map((moduleData, moduleIndex) => {
            const lessons = moduleData.lessons
            var moduleIsDisabled = true

            if(moduleIndex == 0){
                moduleIsDisabled = false

            }else if(moduleIndex != 0){
                if(module[moduleIndex - 1].finished.indexOf(studentEnrolledId.toString()) != -1){
                    moduleIsDisabled = false
                }
            }

            finalValue.push({
                module_id: moduleData._id,
                disabled: moduleIsDisabled,
                lessons: []
            })

            lessons.map((lessonsData, lessonsIndex) => {
                var lessonIsDisabled = true

                if(lessonsIndex == 0){
                    lessonIsDisabled = false
    
                }else if(lessonsIndex != 0){
                    if(lessons[lessonsIndex - 1].finished.indexOf(studentEnrolledId.toString()) != -1){
                        lessonIsDisabled = false
                    }
                }
                
                finalValue[moduleIndex].lessons.push({
                    module_lesson_id: lessonsData._id,
                    lesson_name: lessonsData.lesson_id.name,
                    classwork_code: lessonsData.lesson_id.classwork_code,
                    disabled: lessonIsDisabled
                })

            })
        })

        var allModuleIds = []
        
        module.map(module => {
            allModuleIds.push(module.module_id)
        })

        const allModule = await AllModule.find({_id: {$in: allModuleIds}})

        for(var i = 0; i < allModuleIds.length; i++){
            for(j = 0; j < allModuleIds.length; j++){
                if(allModule[j]._id.toString() == allModuleIds[i]){
                    finalValue[i].name = allModule[j].name
                    finalValue[i].topic_name = allModule[j].topic_name
                    finalValue[i].classwork_code = allModule[j].classwork_code
                    finalValue[i].downloadable_module = {
                        filename: allModule[j].whole_content.filename,
                    }
                }
            }
        }

        return res.json(finalValue)

        
    } catch (error) {
        return res.json([])
        
    }
}

exports.getClassroomDescription = async (req, res) => {
    const classCode = req.params.class_code

    try {
        const classroom = await Classroom.findOne({class_code: classCode})
        return res.json(classroom.description)
        
    } catch (error) {
        return res.json("Error")
        
    }
}

exports.getModule = async(req, res) =>{
    const moduleId = req.params.module_id

    try {
        const module = await Module.findOne({_id: moduleId})
        const allModuleId = module.module_id
        const allModule = await AllModule.findOne({_id: allModuleId})
        return res.json(allModule.files.file)

    } catch (error) {
        return res.json("Error")
    }
}

exports.getLesson = async(req, res) =>{
    const moduleLessonId = req.params.module_lesson_id

    try {
        const moduleLesson = await ModuleLesson.findOne({_id: moduleLessonId})
        const lessonId = moduleLesson.lesson_id
        const lesson = await Lesson.findOne({_id: lessonId})
        return res.json(lesson.files.file)

    } catch (error) {
        return res.json("Error")
    }
}

exports.downloadModule = async(req, res) => {
    const moduleId = req.params.module_id

    try {
        const module = await Module.findOne({_id: moduleId})
        const allModuleId = module.module_id
        const allModule = await AllModule.findOne({_id: allModuleId})
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=" + allModule.whole_content.filename
          });
        res.end(allModule.whole_content.file)

    } catch (error) {
        console.log("Error")
    }
}

exports.moduleFinish = (req, res) => {
    const studentId = req.body["student_id"]
    const classCode = req.body["class_code"]
    const moduleId = req.body["module_id"]
    var studentEnrolledId = ""
    var classroomId = ""

    Classroom.findOne({class_code: classCode}, (err, result) =>{
        if(err){
            return res.json("Error")
        }
        else{
            if(result != null){
                classroomId = result._id

                StudentEnrolled.findOne({classroom_id: classroomId, students: studentId}, (err, result) =>{
                    if(err){
                        return res.json("Error")
                    }
                    else{
                        if(result != null){
                            studentEnrolledId = result._id

                            StudentEnrolled.updateOne({_id: studentEnrolledId}, {$push: {module_finish: [moduleId]}}, (err, result) =>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                }
                            })

                            Module.updateOne({_id: moduleId}, {$push: {finished: [studentEnrolledId]}}, (err, result) =>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    res.json("Module Finish")
                                }
                            })
                            
                        }else{
                            return res.json("Error")
                        }
                    }
                })
                
            }else{
                return res.json("Error")
            }
        }
    })
}

exports.getClassroomTeacherFullname = (req, res) =>{
    const classCode = req.params.class_code

    Classroom.findOne({class_code: classCode}, (err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            if(result != null){
                res.json(result.teacher_name)
            }
        }
    })
}

exports.getClassroomStudents = (req, res) =>{
    const classCode = req.params.class_code
    var finalValue = []

    Classroom.findOne({class_code: classCode}).populate("student").exec((err, result) =>{
        if(err){
            console.log(err)
        }
        else{
            if(result != null){
                result.student.map((result, i) => {
                    finalValue.push({
                        _id: i,
                        student_name: result.student_name
                    }
                    )
                })

                res.json(finalValue)
            }
        }
    })
}
