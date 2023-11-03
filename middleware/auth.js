const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authorization = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
const token = authorizationHeader.split(" ")[1]; 
// //console.log(token);
    const userId = jwt.verify(token, process.env.JWT);
    const user = await User.findById(userId.userId);
// //console.log(user);
    if (user) {
      req.user = user;
      next();
    }
  } catch (error) {
    return res.status(401).json({ success: false });
  }
};

module.exports = authorization;
