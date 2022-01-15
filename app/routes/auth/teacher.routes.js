module.exports = (app) => {
  const teacher = require("../../controller/auth/teacher.controller");

  var router = require("express").Router();

  router.put("/teacher/update", teacher.updateTeacher);
  router.get("/teacher/get/:teacherID", teacher.getTeacher);

  app.use("/api", router);
};
