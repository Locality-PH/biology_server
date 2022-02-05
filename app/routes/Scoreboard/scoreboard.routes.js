module.exports = (app) => {
    const scoreboardController = require("../../controller/Scoreboard/scoreboard");
    var router = require("express").Router();
  
    router.post("/create", scoreboardController.createScoreboard);
    router.post("/validate/student/", scoreboardController.validateStudent);
    
    app.use("/api/scoreboard", router);
  };
  