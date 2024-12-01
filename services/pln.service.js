const PLN = require("../models/pln.model");

class PLNService {
    static async insertDatas(datas) {
        const insertedDatas = await PLN.bulkCreate(datas);
        return insertedDatas.map(data => data.toJSON());
    }
}

module.exports = PLNService