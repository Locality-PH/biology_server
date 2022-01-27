module.exports = (app) => {
  const quizController = require("../../controller/Classroom/quiz.controller");
  var router = require("express").Router();

  router.post("/create-quiz", quizController.createQuiz);
  router.post("/update", quizController.updateQuiz);
  router.post("/get/:Qid", quizController.getQuiz)
  router.post("/get/code/:quiz_code", quizController.getTeacherQuizByCode)
  router.post("/student/get/code/:quiz_code", quizController.getStudentQuizByCode)
  router.post("/get-all/:tid", quizController.getAllQuiz)
  router.delete("/delete", quizController.deleteQuiz)
  
  app.use("/api/quiz", router);
};
