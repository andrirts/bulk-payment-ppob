const PLN = require("../models/pln.model");

class PLNService {
  static async insertDatas(datas) {
    const insertedDatas = await PLN.bulkCreate(datas);
    return insertedDatas.map((data) => data.toJSON());
  }

  static async updateDatas(datas) {
    await Promise.all(
      datas.map(async (data) => {
        await PLN.update(data, { where: { id: data.id } });
      })
    );

    return await PLN.findAll({
      where: { id: datas.map((data) => data.id) },
    });
  }

  static async findByOrderId(datas) {
    return await PLN.findAll({
      where: { order_id: datas.map((data) => data.order_id) },
    });
  }
}

module.exports = PLNService;
