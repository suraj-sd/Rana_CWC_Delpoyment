const customer = require("./customer_details.model");
const transporter = require("../../../config/mail");

exports.bookSlot = async (req, res) => {
  try {
    const booking = new customer(req.body);
    await booking.save();

    res.status(201).json({
      success: true,
      message: "Slot booked successfully",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "This slot is already booked",
      });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  const { date, employee_id } = req.query;

  const slots = [];
  for (let h = 8; h < 18; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
  }

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentHour = now.getHours();

  const booked = await customer
    .find({
      booking_date: date,
      employee_id,
    })
    .select("booking_time -_id");

  let available = slots.filter(
    (s) => !booked.map((b) => b.booking_time).includes(s),
  );

  if (date === today) {
    available = available.filter(
      (s) => parseInt(s.split(":")[0]) > currentHour,
    );
  }

  res.json({ available });
};

exports.getCustomer = async (req, res) => {
  try {
    const { page = 1, limit = 5, employee_id } = req.query;

    let filter = {};

    if (employee_id) {
      filter.employee_id = employee_id;
    }

    const skip = (page - 1) * limit;

    const data = await customer
      .find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await customer.countDocuments(filter);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  let _id = req.params._id;
  try {
    const getSlot = await customer.deleteOne({ _id: _id });
    res.status(201).json({
      success: true,
      message: "Slot Delete Successfully",
      data: getSlot,
    });
  } catch (err) {
    res.status(500).json({
      success: true,
      err: err.message,
    });
  }
};

exports.updateCustomer = async (req, res) => {
  const { _id } = req.params;

  try {
    const updatedSlot = await customer.findByIdAndUpdate(
      _id,
      {
        $set: {
          service_status: true,
        },
      },
      { new: true },
    );

    if (!updatedSlot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Slot Updated Successfully",
      data: updatedSlot,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
