module.exports = (app) => {
    const scoreboardController = require("../../controller/Scoreboard/scoreboard");
    var router = require("express").Router();
  
    router.post("/create", scoreboardController.createScoreboard);
    router.post("/validate/student/", scoreboardController.validateStudent);
    
    router.get("/get-student-lesson-score/:student_enrolled_id", scoreboardController.getStudentLessonScore)
    router.get("/get-student-module-score/:student_enrolled_id", scoreboardController.getStudentModuleScore)

    router.get("/get-students-lesson-score/:module_lesson_id", scoreboardController.getStudentsLessonScore)
    router.get("/get-students-module-score/:module_id", scoreboardController.getStudentsModuleScore)


    // router.put("/update", scoreboardController.updateQuiz);
    // router.post("/get/:Qid", scoreboardController.getQuiz)
    // router.post("/get/code/:quiz_code", scoreboardController.getQuizByCode)
    // router.post("/get-all/:tid", scoreboardController.getAllQuiz)
    // router.delete("/delete", scoreboardController.deleteQuiz)
    
    app.use("/api/scoreboard", router);
  };
  