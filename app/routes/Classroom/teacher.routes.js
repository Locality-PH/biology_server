module.exports = (app) => {
    const teacherController = require("../../controller/Classroom/teacher.controller")
    var router = require("express").Router();
    
    router.post("/create-classroom", teacherController.createClassroom);
    router.get("/get-classrooms/:user_id", teacherController.getClassrooms);
    router.get("/visit-classroom/:classroom_id", teacherController.visitClassroom);
    router.post("/delete-classroom", teacherController.deleteClassroom);
  
    app.use("/teacher", router);
  };