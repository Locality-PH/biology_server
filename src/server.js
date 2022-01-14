const express = require("express");
const fileUpload = require("express-fileupload");
const serverless = require("serverless-http");

const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = require("./app/models");
const router = express.Router();
app.use(`/.netlify/functions/api`, router);

require("./app/auth");
db.mongoose
  .connect(
    "mongodb+srv://vonypet:vonypet@cluster0.tfhbu.mongodb.net/Biology?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
//simple route
app.get("/", (_, res) => {
  res.json({ message: "Welcome to vonypet application." });
});
//routes
// require("./app/routes/users.routes")(app);
// require("./app/routes/exercises.routes")(app);
require("./app/routes/")(app);
// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
module.exports.handler = serverless(app);
