const jwt = require("jsonwebtoken");
const User = require("../models/userModel")
// *{<-------------IsAuthenticated / login or not---------->}*

const isAuthenticated = async (req, res, next) => {
  try {


    const token = req.cookies['token'];
    const logs = []; // Array to store logs

    logs.push('Hi');
    logs.push(`Token: ${token}`);
    logs.push('Request Cookies:', req.cookies);

    if (!token) {
      logs.push('Token not found. User is not authenticated.');
      return res.status(401).json({
        success: false,
        message: "Login First",
        logs: logs, // Include logs in the response
      });
    }
    const {id} =jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({_id:id});

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// *{<-------------Role Authentication---------->}*

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: `Role: ${req.user.role} is not allowed to access the resource`,
      });
    }
  };
};

module.exports = { isAuthenticated, authorizeRole };
