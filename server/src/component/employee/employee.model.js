const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employee_name: String,
  isActive: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("employee", employeeSchema);
