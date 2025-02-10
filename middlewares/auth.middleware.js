const UserService = require("../services/user.service");
const bcrypt = require("bcrypt");

class AuthMiddleware {
  static async auth(req, res, next) {
    const { username, partner_id, pin, password } = req.body;
    if (!username || !partner_id || !pin || !password) {
      return res.status(400).json({
        error: true,
        information: "Missing required fields",
      });
    }

    const findUserByUsername = await UserService.findByUsername(username);

    if (!findUserByUsername) {
      return res.status(400).json({
        error: true,
        information: "User not found",
      });
    }

    const checkPassword = await bcrypt.compare(
      password,
      findUserByUsername.password
    );
    const checkPin = await bcrypt.compare(pin, findUserByUsername.pin);
    if (
      !checkPassword ||
      !checkPin ||
      findUserByUsername.partner_id != partner_id
    )
      return res.status(400).json({
        error: true,
        information: "Invalid credentials",
      });

    next();
  }
}

module.exports = AuthMiddleware;
