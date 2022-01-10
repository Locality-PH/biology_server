module.exports = (app) => {
    const studentController = require("../../controller/Classroom/student.controller")
    var router = require("express").Router();
    
    router.post("/join-classroom", studentController.joinClassroom);
    router.get("/get-classrooms/:student_id", studentController.getClassrooms);
    // router.get("/visit-classroom/:classroom_id", studentController.visitClassroom);
    // router.post("/delete-classroom", studentController.deleteClassroom);
  
    app.use("/student", router);
  };