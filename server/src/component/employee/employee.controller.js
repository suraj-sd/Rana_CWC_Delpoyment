const Employee = require("./employee.model");

exports.createEmployee = async (req, res) => {
  try {
    let { employee_name, isActive } = req.body;
    if (employee_name) {
      employee_name =
        employee_name.charAt(0).toUpperCase() +
        employee_name.slice(1).toLowerCase();
    }
    const employee = new Employee({
      employee_name,
      isActive,
    });
    const data = await employee.save();
    res.status(200).send({
      success: true,
      msg: "Employee Created Successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
};

exports.getEmployee = async (req, res) => {
  let isActive = true;
  try {
    const data = await Employee.find({ isActive: isActive });
    res
      .status(200)
      .send({ success: true, msg: "Employee Found Successfully", data: data });
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
};
