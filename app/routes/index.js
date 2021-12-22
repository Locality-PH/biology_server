module.exports = (app) => {
  require("./auth/accounts.routes")(app);
  require("./Classroom/teacher.routes")(app);
  require("./auth/teacher.routes")(app);
  //   require("./app/routes/exercises.routes")(app);
};
