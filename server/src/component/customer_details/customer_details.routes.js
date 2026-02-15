const express = require("express");
const router = express.Router();
const controller = require("./customer_details.controller");

router.post("/addCustomer", controller.bookSlot);
router.get("/getAvailableSlots", controller.getAvailableSlots);
router.get("/getCustomer", controller.getCustomer);
router.delete("/deleteCustomer/:_id", controller.deleteCustomer);

router.put("/updateCustomer/:_id", controller.updateCustomer);

module.exports = router;
