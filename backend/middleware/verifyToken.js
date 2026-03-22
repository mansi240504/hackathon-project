const jwt = require("jsonwebtoken");
const User = require('../models/user_model'); 
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Auth Header:", req.header("Authorization"));
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied! No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // ✅ store decoded user info in request
    next(); // ✅ allow route to continue
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid or expired token!" });
  }
};

module.exports = verifyToken;
