const mongoose = require("mongoose");

// const customerSchema = new mongoose.Schema({
//   customer_fname: String,
//   customer_lname: String,
//   customer_email: String,
//   customer_phone: String,
//   customer_note: String,
//   employee_id: {
//     type: mongoose.Schema.Types.ObjectId,
//   },
//   service_id: {
//     type: mongoose.Schema.Types.ObjectId,
//   },
// });

// module.exports = mongoose.model("customer", customerSchema);

const bookingSchema = new mongoose.Schema(
  {
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },

    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
      required: true,
    },

    booking_date: {
      type: String,
      required: true,
    },
    service_status: {
      type: Boolean,
      default: false,
    },
    service_price: {
      type: String,
      required: true,
    },

    booking_time: {
      type: String,
      required: true,
    },

    customer_name: String,
    customer_email: String,
    customer_phone: String,
    customer_note: String,
  },
  { timestamps: true }
);

// ❌ Prevent double booking
bookingSchema.index(
  { booking_date: 1, booking_time: 1, employee_id: 1 },
  { unique: true }
);

module.exports = mongoose.model("booking", bookingSchema);
