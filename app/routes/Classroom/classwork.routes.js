module.exports = (app) => {
  const classworkController = require("../../controller/Classroom/classwork.controller");
  var router = require("express").Router();

  router.post("/create-classwork", classworkController.createClasswork);
  router.put("/update", classworkController.updateClasswork);
  router.post("/get/:Cid", classworkController.getClasswork)
  router.post("/get/code/:classwork_code", classworkController.getTeacherClassworkByCode)
  router.post("/student/get/code/:classwork_code", classworkController.getStudentClassworkByCode)
  router.post("/get-all/:tid", classworkController.getAllClasswork)
  router.delete("/delete", classworkController.deleteClasswork)
  
  router.post("/upload/image", classworkController.uploadImage)
  app.use("/api/classwork", router);
};
