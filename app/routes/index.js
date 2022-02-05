module.exports = (app) => {
  require("./auth/accounts.routes")(app);
  require("./Classroom/module.routes")(app);
  require("./Classroom/teacher.routes")(app);
  require("./Classroom/student.routes")(app);
  require("./Classroom/classwork.routes")(app);
  require("./Scoreboard/scoreboard.routes")(app);
  require("./auth/teacher.routes")(app);
  //   require("./app/routes/exercises.routes")(app);
};
