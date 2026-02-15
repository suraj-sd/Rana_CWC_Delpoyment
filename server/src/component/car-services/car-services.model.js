const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  service_name: String,
  service_price: String,
  isActive: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("service", serviceSchema);
