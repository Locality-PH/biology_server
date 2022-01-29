module.exports = (app) => {
    const moduleController = require("../../controller/Classroom/module.controller");
    var router = require("express").Router();

    router.post("/create-my-module", moduleController.createMyModule);
    router.get("/get-my-modules/:teacher_id", moduleController.getMyModules);
  
    router.post("/create-preset-module", moduleController.createPresetModule);
    router.get("/get-preset-modules", moduleController.getPresetModules);
  
    app.use("/api/module", router);
  };
  