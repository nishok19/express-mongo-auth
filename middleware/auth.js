const jwt = require("jsonwebtoken");
const { SECRET } = process.env;

const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies || req.body;

    if (!token) res.status(401).send("No token found login again");
    const user = jwt.verify(token, SECRET);
    req.body = user;
    console.log(user);
    next();
  } catch (err) {
    console.log("JSON token error ", err);
  }
};

module.exports = auth;
