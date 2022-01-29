module.exports = (app) => {
    const moduleController = require("../../controller/Classroom/module.controller");
    var router = require("express").Router();

    router.post("/create-my-module", moduleController.createMyModule);
    router.get("/get-my-modules/:teacher_id", moduleController.getMyModules);
    router.post("/delete-my-module", moduleController.deleteMyModule);
  
    router.post("/create-preset-module", moduleController.createPresetModule);
    router.get("/get-preset-modules", moduleController.getPresetModules);
    router.post("/delete-preset-module", moduleController.deletePresetModule);
  
    app.use("/api/module", router);
  };
  