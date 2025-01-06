const axios = require("axios");
const { PAYMENT_ACCOUNT_CONFIG, URL_CONFIG } = require("../config/constants");
const nodeCacheService = require("../services/node-cache.service");
const ExcelHelper = require("../helper/excelHelper");
const TransactionService = require("../services/transaction.service");
const PaymentService = require("../services/payment.service");

class PrepaidController {

    static async callback(req, res, next) {
        const data = req.body;
        const getRequestId = nodeCacheService.get(data.reffid);
        console.log(data);
        // console.log(nodeCacheService.keys());
        console.log(getRequestId);
        if (!getRequestId) {
            return res.status(404).json({
                error: true,
                information: "Transaction ID Not Found",
            });
        }
        if (data.reffid != getRequestId.reffid) {
            return res.status(400).json({
                error: true,
                information: "Invalid Transaction ID",
            });
        }

        nodeCacheService.set(data.reffid, {
            ...data,
        });
        // console.log(nodeCacheService.keys());
        return res.status(200).json({
            status: true,
            information: "OK",
        });
    }

    static async payment(req, res, next) {
        const file = req.file;
        const datas = (await ExcelHelper.convertExcelDataToArray(file)).map(
            (data) => {
                if (
                    data["Customer ID"] === undefined ||
                    data["Product Code"] === undefined
                ) {
                    throw new Error("Some rows is not valid");
                }
                data["customer_id"] = data["Customer ID"];
                data["product_code"] = data["Product Code"];
                data['order_id'] = data['Order ID']['result']
                delete data["Customer ID"];
                delete data["Product Code"];
                delete data['Order ID'];
                return data;
            }
        );
        const insertDatas = await TransactionService.insertDatas(datas);
        const dataTransactions = await PaymentService.processTransactions(
            insertDatas,
            PaymentService.payPrepaidTransactions.bind(PaymentService)
        );
        const newDatas = await TransactionService.updateDatas(dataTransactions);
        const generateExcel = await ExcelHelper.writePaymentPrepaidToExcel(newDatas);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=Payment.xlsx");
        return res.status(200).send(generateExcel);
    }
}

module.exports = PrepaidController;
