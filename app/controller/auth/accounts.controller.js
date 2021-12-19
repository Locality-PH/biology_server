const db = require("../../models");
var mongoose = require("mongoose");
const Account = db.account;

exports.registerUser = async (req, res) => {
  var id = new mongoose.Types.ObjectId();
  if (!req.body.email && req.body.uuid) {
    res.status(400).send({ message: "email or password can not be empty!" });
    return;
  }

  console.log(id);
  const users = new Account({
    _id: id,
    uuid: req.body.uuid,
    email: req.body.email,
    role: "Admin",
  });

  await users
    .save(users)
    .then(async (_) => {
      res.json({
        role: "Admin",
        mid: id,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Account.",
      });
    });
};
exports.loginUser = async (req, res) => {
  Account.find({ uuid: req.params.id })
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
};
