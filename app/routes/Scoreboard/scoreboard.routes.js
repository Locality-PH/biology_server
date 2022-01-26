module.exports = (app) => {
    const scoreboardController = require("../../controller/Scoreboard/scoreboard");
    var router = require("express").Router();
  
    router.post("/create", scoreboardController.createScoreboard);
    router.post("/validate/student/", scoreboardController.validateStudent);
    
    // router.put("/update", scoreboardController.updateQuiz);
    // router.post("/get/:Qid", scoreboardController.getQuiz)
    // router.post("/get/code/:quiz_code", scoreboardController.getQuizByCode)
    // router.post("/get-all/:tid", scoreboardController.getAllQuiz)
    // router.delete("/delete", scoreboardController.deleteQuiz)
    
    app.use("/api/scoreboard", router);
  };
  