module.exports = (app) => {
  const accounts = require("../../controller/auth/accounts.controller.js");

  var router = require("express").Router();

  // router.post("/add", accounts.add);
  router.post("/admin/register", accounts.registerUser);
  router.post("/admin/google-login", accounts.loginGoogleUser);
  router.get("/admin/login/:id", accounts.loginUser);
  router.get("/admin/:userID", accounts.getUser);
  router.post("/student/register", accounts.registerUserStudent);
  router.get("/student/login/:id", accounts.loginUserStudent);
  router.post("/student/google-login", accounts.loginGoogleUserStudent);

  app.use("/api", router);
};
