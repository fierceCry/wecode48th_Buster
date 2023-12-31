const jwt = require("jsonwebtoken");
const userService = require("../services/userServices");

const loginRequired = async (req, res, next) => {
  try 
  {
    const accessToken = req.headers['authorization'];
    if (!accessToken) {
      const error = new Error("NEED_ACCESS_TOKEN");
      error.statusCode = 401;
      return res.status(error.statusCode).json({ message: error.message });
    }

    const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await userService.getUserById(payload.id);
    if (!user) {
      console.error(`No user found for id: ${payload.id}`);
      const error = new Error("USER_DOES_NOT_EXIST");
      error.statusCode = 404;
      return res.status(error.statusCode).json({ message: error.message });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Caught an error: ", err);  
    const error = new Error("INVALID_ACCESS_TOKEN");
    error.statusCode = 401;
    return res.status(error.statusCode).json({ message: error.message });
  }
};

module.exports = { loginRequired };
