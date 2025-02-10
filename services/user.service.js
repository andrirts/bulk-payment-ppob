const User = require("../models/user.model");

class UserService {
  static async insertData(data) {
    const insertedData = await User.create(data);
    return insertedData.toJSON();
  }

  static async findByUsername(username) {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error("User Not Found");
    }
    return user.toJSON();
  }
}

module.exports = UserService;
