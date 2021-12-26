module.exports = (app) => {
    const teacherController = require("../../controller/Classroom/teacher.controller")
    var router = require("express").Router();
    
    router.post("/create-classroom", teacherController.createClassroom);
    router.get("/get-classroom-code/:classroom_id", teacherController.getClassroomCode);

    router.get("/get-classrooms/:user_id", teacherController.getClassrooms);
    router.get("/visit-classroom/:class_code", teacherController.visitClassroom);
    router.post("/delete-classroom", teacherController.deleteClassroom);

    router.get("/download-module", teacherController.downloadModule);
  
    app.use("/teacher", router);
  };