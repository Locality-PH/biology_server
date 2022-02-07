module.exports = (app) => {
    const moduleController = require("../../controller/Classroom/module.controller");
    var router = require("express").Router();

    router.get("/get-initial-module/:module_id", moduleController.getInitialModule);

    router.post("/create-my-module", moduleController.createMyModule);
    router.get("/get-my-modules/:teacher_id", moduleController.getMyModules);
    router.post("/delete-my-module", moduleController.deleteMyModule);
    router.post("/update-my-module", moduleController.updateMyModule)
  
    router.post("/create-preset-module", moduleController.createPresetModule);
    router.get("/get-preset-modules", moduleController.getPresetModules);
    router.get("/download-preset-module/:preset_module_id", moduleController.downloadPresetModule)
    router.post("/delete-preset-module", moduleController.deletePresetModule);
    router.post("/update-preset-module", moduleController.updatePresetModule)

    router.get("/get-module-lessons/:module_id", moduleController.getModuleLessons);
  
    app.use("/api/module", router);
  };
  