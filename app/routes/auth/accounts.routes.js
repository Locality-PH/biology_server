module.exports = (app) => {
  const accounts = require("../../controller/auth/accounts.controller.js");

  var router = require("express").Router();

  // router.post("/add", accounts.add);
  router.post("/admin/register", accounts.registerUser);
  router.get("/admin/login/:id", accounts.loginUser);
  router.get("/admin/:userID", accounts.getUser);

  app.use("/", router);
};
