const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminLogin = require("./adminLogin.model");
const userLogin = require("../../user/userLogin/userLogin.model");
const util = require("../../../utils/config");

const adminLogins = {};
const { v4: uuidv4 } = require("uuid");
adminLogins.createAdmin = async (req, res) => {
  const email = req.body.email.toLowerCase();
  console.log("req.body", req.body);
  if (!req.body.email) {
    res.send({
      success: false,
      msg: "Email is required",
    });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const getEmail = await adminLogin.find({ email: email });
    if (getEmail.length > 0) {
      return res.status(200).send({
        success: true,
        msg: "Email Already Exists",
      });
    } else {
      const createAdmin = new adminLogin({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        userType: "admin",
      });
      const data = await createAdmin.save();
      return res.status(201).send({
        success: true,
        msg: "Data Created Successfully",
        data: data,
      });
    }
  } catch (error) {
    return res.status(400).send({
      success: false,
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};

adminLogins.loginAdminAndUser = async (req, res) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Basic ")) {
      return res.status(400).json({
        success: false,
        msg: "Invalid auth",
      });
    }
    const base64 = auth.split(" ")[1];
    const decoded = Buffer.from(base64, "base64").toString("utf8");
    const [email, password] = decoded.split(":");

    const account =
      (await adminLogin.findOne({ email: email.toLowerCase() })) ||
      (await userLogin.findOne({ email: email.toLowerCase() }));

    if (!account) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // Password check
    const passwordOk = bcrypt.compareSync(password, account.password);
    if (!passwordOk) {
      return res.status(401).json({
        success: false,
        msg: "Invalid password",
      });
    }

    const sessionId = uuidv4();

    account.isLoggedIn = true;
    account.activeSessionId = sessionId;
    await account.save();

    // Create JWT
    const token = jwt.sign(
      {
        userId: account._id,
        sessionId,
        userType: account.userType,
      },
      util.admin_token.TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    return res.json({
      success: true,
      token,
      msg: "Login successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

adminLogins.logout = async (req, res) => {
  try {
    const user =
      (await adminLogin.findById(req.user.userId)) ||
      (await userLogin.findById(req.user.userId));

    if (user) {
      user.isLoggedIn = false;
      user.activeSessionId = null;
      await user.save();
    }

    res.json({ success: true, msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

adminLogins.forgotPass = async (req, res) => {};

adminLogins.varifyOTP = async (req, res) => {};

adminLogins.resetPass = async (req, res) => {};

adminLogins.changePass = async (req, res) => {};

module.exports = adminLogins;
