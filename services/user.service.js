const User = require("../models/user.model");

class UserService {

    static async insertData(data) {
        const insertedData = await User.create(data);
        return insertedData.toJSON();
    }

    static async findByUsername(username) {
        const user = await User.findOne({ where: { username } });
        return user.toJSON();
    }

}

module.exports = UserService