const service = require("./car-services.model");

exports.createService = async (req, res) => {
  try {
    let service_price = req.body.service_price;

    // ✅ Add $ by default
    service_price = `$${service_price}`;

    const services = new service({
      service_name: req.body.service_name
        ?.toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase()),

      service_price: service_price,

      isActive: req.body.isActive,
    });

    const data = await services.save();

    res.status(200).send({
      success: true,
      msg: "Service Created Successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      err: err.message,
    });
  }
};

exports.getService = async (req, res) => {
  let isActive = true;
  try {
    const data = await service.find({ isActive: isActive });
    res.status(200).send({
      success: true,
      msg: "Service Found Successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
