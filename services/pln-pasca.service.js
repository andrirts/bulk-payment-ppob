const PLNPasca = require("../models/pln-pasca.model");

class PLNPascaService {
  static async insertDatas(datas) {
    const insertedDatas = await PLNPasca.bulkCreate(datas);
    return insertedDatas.map((data) => data.toJSON());
  }

  static async updateDatas(datas) {
    await Promise.all(
      datas.map(async (data) => {
        await PLNPasca.update(data, { where: { id: data.id } });
      })
    );

    return await PLNPasca.findAll({
      where: { id: datas.map((data) => data.id) },
    });
  }

  static async findByOrderId(id) {
    return await PLNPasca.findOne({
      where: {
        order_id: id
      },
    });
  }

  static async findByIds(datas) {
    const result = await PLNPasca.findAll({
      where: {
        id: datas.map((data) => data.id)
      },
    })
    return result.map((data) => data.toJSON());
  }

}

module.exports = PLNPascaService;
