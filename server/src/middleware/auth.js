const jwt = require("jsonwebtoken");
const adminLogin = require("../component/admin/adminLogin/adminLogin.model");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "No token" });
    }

    const decoded = jwt.verify(token, util.admin_token.TOKEN_SECRET);

    const user = await adminLogin.findById(decoded.userId);

    if (!user || user.activeSessionId !== decoded.sessionId) {
      return res.status(401).json({
        msg: "Session expired. Logged in from another device",
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};
