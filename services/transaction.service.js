const Transaction = require("../models/transaction.model");


class TransactionService {

    static async insertDatas(datas) {
        const insertedDatas = await Transaction.bulkCreate(datas);
        return insertedDatas.map((data) => data.toJSON());
    }

    static async updateDatas(datas) {
        await Promise.all(
            datas.map(async (data) => {
                await Transaction.update(data, { where: { id: data.id } });
            })
        );

        return (await Transaction.findAll({
            where: { id: datas.map((data) => data.id) },
        })).map((data) => data.toJSON());
    }

    static async findByOrderId(id) {
        return await Transaction.findOne({
            where: {
                order_id: id,
            },
        });
    }

    static async findByIds(datas) {
        const result = await Transaction.findAll({
            where: {
                id: datas.map((data) => data.id),
            },
        });
        return result.map((data) => data.toJSON());
    }
}

module.exports = TransactionService