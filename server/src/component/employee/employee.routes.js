const express = require("express");
const router = express.Router();
const controller = require("./employee.controller");

router.post("/addEmployee", controller.createEmployee);
router.get("/getEmployee", controller.getEmployee);
module.exports = router;
