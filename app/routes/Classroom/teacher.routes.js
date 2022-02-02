module.exports = (app) => {
  const teacherController = require("../../controller/Classroom/teacher.controller");
  var router = require("express").Router();

  router.get("/get-teacher-data-count/:teacher_id", teacherController.teacherDataCount)
  router.get("/get-latest-joined-students/:teacher_id", teacherController.latestJoinedStudents)

  router.post("/create-classroom", teacherController.createClassroom);
  router.get(
    "/get-teacher-fullname/:teacher_id",
    teacherController.getTeacherFullName
  );
  router.get(
    "/get-classroom-code/:classroom_id",
    teacherController.getClassroomCode
  );

  router.get("/get-classrooms/:teacher_id", teacherController.getClassrooms);

  router.get("/get-my-modules/:teacher_id/:class_code", teacherController.getMyModules);
  router.get("/get-preset-modules/:class_code", teacherController.getPresetModules);
  router.get(
    "/get-classroom-data/:class_code",
    teacherController.getClassroomData
  );
  router.post(
    "/update-classroom",
    teacherController.updateClassroom
  );

  router.post("/delete-classroom", teacherController.deleteClassroom);

  router.get(
    "/get-classroom-students/:class_code",
    teacherController.getClassroomStudents
  );
  router.post("/delete-student", teacherController.deleteStudent);
  router.get(
    "/get-student-module-finished/:student_enrolled_id",
    teacherController.getStudentModuleFinished
  );

  router.get(
    "/get-classroom-modules/:class_code",
    teacherController.getClassroomModules
  );
  router.post("/delete-module", teacherController.deleteModule);

  router.get("/finished-students/:module_id", teacherController.finishedStudents);

  app.use("/api/teacher", router);
};
