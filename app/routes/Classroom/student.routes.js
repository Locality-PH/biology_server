module.exports = (app) => {
  const studentController = require("../../controller/Classroom/student.controller");
  var router = require("express").Router();

  router.post("/join-classroom", studentController.joinClassroom);
  router.get(
    "/get-student-fullname/:student_id",
    studentController.getStudentFullName
  );
  router.get("/get-classrooms/:student_id", studentController.getClassrooms);

  router.post("/unenrol-classroom", studentController.unEnrol);

  router.get(
    "/get-classroom-modules/:class_code",
    studentController.getClassroomModules
  );
  router.get("/get-module/:module_id", studentController.getModule);
  router.get("/download-module/:module_id", studentController.downloadModule);

  router.get(
    "/get-classroom-students/:class_code",
    studentController.getClassroomStudents
  );

  app.use("/api/student", router);
};
