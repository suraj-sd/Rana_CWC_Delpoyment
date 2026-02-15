const express = require("express");
const router = express.Router();
const controller = require("./car-services.controller");

router.post("/addService", controller.createService);
router.get("/getService", controller.getService);
module.exports = router;
