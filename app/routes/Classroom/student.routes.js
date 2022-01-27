module.exports = (app) => {
  const studentController = require("../../controller/Classroom/student.controller");
  var router = require("express").Router();

  router.put("/update", studentController.updateStudent);
  router.get("/get/:uid", studentController.getStudentAccount);

  router.post("/join-classroom", studentController.joinClassroom);
  router.get(
    "/get-student-fullname/:student_id",
    studentController.getStudentFullName
  );
  router.get("/get-classrooms/:student_id", studentController.getClassrooms);

  router.post("/unenrol-classroom", studentController.unEnrol);

  router.get(
    "/get-classroom-modules/:class_code/:student_id",
    studentController.getClassroomModules
  );
  router.get("/get-module/:module_id", studentController.getModule);
  router.get("/download-module/:module_id", studentController.downloadModule);
  router.post("/module-finish", studentController.moduleFinish);
  router.post("/module-unfinish", studentController.moduleUnFinish);
  
  router.get("/get-classroom-teacher-fullname/:class_code", studentController.getClassroomTeacherFullname);
  router.get(
    "/get-classroom-students/:class_code",
    studentController.getClassroomStudents
  );

  app.use("/api/student", router);
};
