module.exports = (app) => {
  require("./auth/accounts.routes")(app);

  //   require("./app/routes/exercises.routes")(app);
};
