const db = require("../../models");
var mongoose = require("mongoose");

const Account = db.account;
const Teacher = db.teacher;
const Student = db.student;

exports.registerUser = async (req, res) => {
  var account_id = new mongoose.Types.ObjectId();
  var teacher_id = new mongoose.Types.ObjectId();
  const email = req.body.email;
  if (!req.body.email && req.body.uuid) {
    res.status(400).send({ message: "email or password can not be empty!" });
    return;
  }

  await Account.exists({ email: email }, async (err, result) => {
    if (err) {
      console.log(err);
    } else {
      currentUserId = result;
      if (currentUserId !== null) {
        // if user existed
        console.log("user exist");
        res.json("user already exist");
      } else {
        console.log(account_id);
        const users = new Account({
          _id: account_id,
          uuid: req.body.uuid,
          email: req.body.email,
          full_name: req.body.fullName,
          role: "Admin",
          teacher: teacher_id,
        });
        const teacher = new Teacher({
          _id: teacher_id,
        });
        await users
          .save(users)
          .then(async (_) => {
            await teacher
              .save(teacher)
              .then(async (_) => {
                res.json({
                  role: "Admin",
                  mid: account_id,
                  tid: teacher_id,
                });
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while creating the Account.",
                });
              });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the Account.",
            });
          });
      }
    }
  });
};

exports.loginUser = async (req, res) => {
  Account.find({ uuid: req.params.id })
    // .populate({ path: "teacher", model: "teachers" })

    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
};
exports.loginUserStudent = async (req, res) => {
  Account.find({ uuid: req.params.id })
    // .populate({ path: "student", model: "students" })

    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
};
exports.getUser = (req, res) => {
  const userID = req.params.userID;
  console.log(userID);

  try {
    Account.findById(userID, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        console.log(result);
        res.json(result);
      }
    }).populate("teacher");
  } catch (error) {
    console.log(error);
  }
};

exports.loginGoogleUser = async (req, res) => {
  const user = req.body.user;
  const email = user.email;
  const uid = user.uid;
  const splitUser = user.displayName;
  const namelist = splitUser.split(" ");
  var currentUserId;
  console.log(namelist[0]);
  console.log(email);
  console.log(uid);

  //Check if user exist
  await Account.exists({ email }, async (err, result) => {
    if (err) {
      console.log(err);
    } else {
      currentUserId = result;
      if (currentUserId !== null) {
        // if user existed
        console.log(currentUserId);
        res.json(uid);
      } else {
        console.log("user need to be register");

        var account_id = new mongoose.Types.ObjectId();
        var teacher_id = new mongoose.Types.ObjectId();

        console.log(account_id);
        console.log(teacher_id);

        const users = new Account({
          _id: account_id,
          uuid: uid,
          email: email,
          // first_name: namelist[0],
          // last_name: namelist[1],
          full_name: user.displayName,
          role: "Admin",
          teacher: teacher_id,
        });
        const teacher = new Teacher({
          _id: teacher_id,
        });
        await users
          .save(users)
          .then(async (_) => {
            await teacher.save(teacher).catch((err) => {
              console.log(err);
            });
          })
          .catch((err) => {
            console.log(err);
          });

        console.log("Account registered");
        console.log(uid);
        res.json(uid);
      }
    }
  });
};
exports.loginGoogleUserStudent = async (req, res) => {
  const user = req.body.user;
  const email = user.email;
  const uid = user.uid;
  const splitUser = user.displayName;
  const namelist = splitUser.split(" ");
  var currentUserId;
  console.log(email);
  console.log(user.displayName);

  //Check if user exist
  await Account.exists({ email: email }, async (err, result) => {
    if (err) {
      console.log(err);
    } else {
      currentUserId = result;
      if (currentUserId !== null) {
        // if user existed
        console.log("user exist");
        res.json(uid);
      } else {
        console.log("user need to be register");

        var account_id = new mongoose.Types.ObjectId();
        var student_id = new mongoose.Types.ObjectId();

        console.log(account_id);
        console.log(student_id);

        const users = new Account({
          _id: account_id,
          uuid: uid,
          email: email,
          role: "Student",
          full_name: user.displayName,
          student: student_id,
        });
        const student = new Student({
          _id: student_id,
        });
        await users
          .save(users)
          .then(async (_) => {
            await student.save(student).catch((err) => {
              console.log(err);
            });
          })
          .catch((err) => {
            console.log(err);
          });

        console.log("Account registered");
        console.log(uid);
        res.json(uid);
      }
    }
  });
};
exports.registerUserStudent = async (req, res) => {
  var account_id = new mongoose.Types.ObjectId();
  var student_id = new mongoose.Types.ObjectId();

  if (!req.body.email && req.body.uuid) {
    res.status(400).send({ message: "email or password can not be empty!" });
    return;
  }

  console.log(account_id);
  const users = new Account({
    _id: account_id,
    uuid: req.body.uuid,
    email: req.body.email,
    full_name: req.body.full_name,
    role: "Student",
    student: student_id,
  });
  const student = new Student({
    _id: student_id,
  });
  await users
    .save(users)
    .then(async (_) => {
      await student
        .save(student)
        .then(async (_) => {
          res.json({
            role: "Student",
            mid: account_id,
            sid: student_id,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Account.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Account.",
      });
    });
};
