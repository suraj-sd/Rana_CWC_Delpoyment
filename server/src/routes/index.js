const express = require("express");

const adminLogin = require("../component/admin/adminLogin/adminLogin.routes");
const userLogin = require("../component/user/userLogin/userLogin.routes");
const role = require("../component/role/role.routes");
const carServices = require("../component/car-services/car-services.routes");
const customerDetails = require("../component/customer_details/customer_details.routes");
const employee = require("../component/employee/employee.routes");

let version = "/api/v1";

module.exports = (app) => {
  app.use(version + "/admin", adminLogin);
  app.use(version + "/user", userLogin);
  app.use(version + "/role", role);
  app.use(version + "/carService", carServices);
  app.use(version + "/customerDetail", customerDetails);
  app.use(version + "/employee", employee);
};
