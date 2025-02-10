const bcrypt = require("bcrypt");
const UserService = require("../services/user.service");

class UserController {
  static async register(req, res, next) {
    const { username, password, pin, partner_id } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10);

    await UserService.insertData({
      username,
      password: hashedPassword,
      pin: hashedPin,
      partner_id,
    });

    res.status(201).json({
      information: "User created successfully",
    });
  }
}

module.exports = UserController;
