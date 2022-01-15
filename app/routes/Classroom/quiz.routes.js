module.exports = (app) => {
    const quizController = require("../../controller/Classroom/quiz.controller")
    var router = require("express").Router();
    
    router.post("/create-quiz", quizController.createQuiz);
    app.use("api/quiz", router);
  };