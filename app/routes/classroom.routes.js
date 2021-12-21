const express = require("express");
const router = express.Router();

const classroomController = require("../controller/classroom.controller")

router.get("/", classroomController.createClassroom);

module.exports = router;