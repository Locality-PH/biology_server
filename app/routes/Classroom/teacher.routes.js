module.exports = (app) => {
    const teacherController = require("../../controller/Classroom/teacher.controller")
    var router = require("express").Router();
    
    router.post("/create-classroom", teacherController.createClassroom);
    router.get("/get-classroom-code/:classroom_id", teacherController.getClassroomCode);

    router.get("/get-classrooms/:user_id", teacherController.getClassrooms);
    router.post("/delete-classroom", teacherController.deleteClassroom);

    router.get("/get-classroom-modules/:class_code", teacherController.getClassroomModules);
    router.get("/download-module/:module_id", teacherController.downloadModule);
    router.post("/delete-module", teacherController.deleteModule);

    app.use("/teacher", router);
  };