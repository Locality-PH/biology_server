const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

//accounts
db.account = require("./auth/accounts.model.js")(mongoose);
//Teachers
db.teacher = require("./teacher/teacher.model.js")(mongoose);
db.classroom = require("./teacher/classroom.model.js")(mongoose);
db.classwork = require("./teacher/classrooms/classwork/classworks.model")(mongoose);
db.scoreboard = require("./teacher/scoreboard/scoreboard.js")(mongoose);
db.modules = require("./teacher/classrooms/modules.model.js")(mongoose);
db.student_enrolled = require("./teacher/classrooms/student-enrolled.model.js")(
  mongoose
);

//Modules
db.allmodules = require("./teacher/all-modules.model")(mongoose)
db.lessons = require("./teacher/lesson.model")(mongoose)
db.modulelessons = require("./teacher/module-lessons.model")(mongoose)
//Students
db.student = require("./student/student.model.js")(mongoose);

module.exports = db;
