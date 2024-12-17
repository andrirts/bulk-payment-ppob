const PLNPrepaid = require("../models/pln-prepaid.model");

class PLNPrepaidService {
  static async insertDatas(datas) {
    const insertedDatas = await PLNPrepaid.bulkCreate(datas);
    return insertedDatas.map((data) => data.toJSON());
  }

  static async updateDatas(datas) {
    await Promise.all(
      datas.map(async (data) => {
        await PLNPrepaid.update(data, { where: { id: data.id } });
      })
    );

    return await PLNPrepaid.findAll({
      where: { id: datas.map((data) => data.id) },
    });
  }

  static async findByOrderId(id) {
    return await PLNPrepaid.findOne({
      where: {
        order_id: id,
      },
    });
  }

  static async findByIds(datas) {
    const result = await PLNPrepaid.findAll({
      where: {
        id: datas.map((data) => data.id),
      },
    });
    return result.map((data) => data.toJSON());
  }
}

module.exports = PLNPrepaidService;
