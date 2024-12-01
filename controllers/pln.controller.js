const ExcelHelper = require("../helper/excelHelper");
const PLN = require("../models/pln.model");
const PaymentService = require("../services/payment.service");
const PLNService = require("../services/pln.service");

class PLNController {

    static async inquiry(req, res, next) {
        const file = req.file;
        const datas = (await ExcelHelper.convertExcelDataToArray(file)).map(data => {
            data['order_id'] = data['Order ID']['result'];
            data['customer_id'] = data['Customer ID'];
            data['product_code'] = data['Product Code'];
            delete data['Order ID'];
            delete data['Customer ID'];
            delete data['Product Code'];
            return data
        });
        const insertedDatas = await PLNService.insertDatas(datas);
        const [dataTransactions, errorDatas] = await this.processTransactions(insertedDatas);

        return res.status(200).json(dataTransactions);
    }

    // static async processTransactions(insertDatas) {
    //     const batchSize = 1; // Number of transactions per batch
    //     const results = [];

    //     // Helper function to split data into chunks
    //     const chunkArray = (array, size) => {
    //         const chunks = [];
    //         for (let i = 0; i < array.length; i += size) {
    //             chunks.push(array.slice(i, i + size));
    //         }
    //         return chunks;
    //     };

    //     // Split the input data into batches
    //     const batches = chunkArray(insertDatas, batchSize);

    //     for (const batch of batches) {
    //         // Process a batch
    //         const transactionPromises = batch.map(async data => {
    //             try {
    //                 return await PaymentService.transactions(data);
    //             } catch (err) {
    //                 return { error: true, message: err.message };
    //             }
    //         });

    //         // Wait for the batch to complete
    //         const batchResults = await Promise.allSettled(transactionPromises);

    //         // Collect results
    //         results.push(
    //             ...batchResults.map(result => {
    //                 if (result.status === 'fulfilled') {
    //                     return result.value; // Success response
    //                 } else {
    //                     return {
    //                         error: true,
    //                         message: result.reason.message,
    //                         noPelanggan: result.reason?.tujuan || null, // Error response
    //                     };
    //                 }
    //             })
    //         );
    //     }

    //     return results;
    // }

    static async processTransactions(insertedDatas) {
        const datas = [];
        const errorDatas = [];
        for (const data of insertedDatas) {
            try {
                const transactions = await PaymentService.transactions(data);
                if (transactions.error) errorDatas.push(transactions);
                else datas.push(transactions);
            } catch (err) {
                return { error: true, message: err.message };
            }
        }
        return [datas, errorDatas];
    }


}

module.exports = PLNController;