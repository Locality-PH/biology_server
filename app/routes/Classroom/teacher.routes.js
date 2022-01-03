module.exports = (app) => {
    const teacherController = require("../../controller/Classroom/teacher.controller")
    var router = require("express").Router();
    
    router.post("/create-classroom", teacherController.createClassroom);
    router.get("/get-classroom-code/:classroom_id", teacherController.getClassroomCode);

    router.get("/get-classrooms/:user_id", teacherController.getClassrooms);

    router.get("/get-classroom-data/:class_code", teacherController.getClassroomData);
    router.post("/update-classroom/:class_code", teacherController.updateClassroom);

    router.post("/delete-classroom", teacherController.deleteClassroom);

    router.get("/get-classroom-students/:class_code", teacherController.getClassroomStudents)

    router.get("/get-classroom-modules/:class_code", teacherController.getClassroomModules);
    router.get("/view-module/:module_id", teacherController.viewModule);
    router.get("/get-module/:module_id", teacherController.getModule);
    router.get("/download-module/:module_id", teacherController.downloadModule);
    router.post("/delete-module", teacherController.deleteModule);

    app.use("/teacher", router);
};