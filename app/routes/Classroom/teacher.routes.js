module.exports = (app) => {
    const teacherController = require("../../controller/Classroom/teacher.controller")
    var router = require("express").Router();
    
    router.post("/create-classroom", teacherController.createClassroom);
    router.get("/get-classroom", teacherController.getClassroom);
    // router.get("/classroom", teacherController.getClassroom);
    // router.get("/classroom", teacherController.getClassroom);
  
    app.use("/teacher", router);
  };