const ExcelHelper = require("../helper/excelHelper");
const nodeCacheService = require("../services/node-cache.service");
const PaymentService = require("../services/payment.service");
const TransactionService = require("../services/transaction.service");

class PLNPrepaidController {
    static async inquiry(req, res, next) {
        console.log("test");
        const file = req.file;
        const datas = (await ExcelHelper.convertExcelDataToArray(file)).map(
            (data) => {
                if (
                    data["Order ID"] === undefined ||
                    data["Customer ID"] === undefined ||
                    data["Product Code"] === undefined
                ) {
                    throw new Error("Some rows is not valid");
                }
                data["order_id"] = data["Order ID"]["result"];
                data["customer_id"] = data["Customer ID"];
                data["product_code"] = data["Product Code"];
                data["operator"] = "PLN TOKEN";
                data["admin_fee"] = 2900;
                delete data["Order ID"];
                delete data["Customer ID"];
                delete data["Product Code"];
                return data;
            }
        );
        const insertedDatas = await TransactionService.insertDatas(datas);
        const dataTransactions = await PaymentService.processTransactions(
            insertedDatas,
            PaymentService.inqPLNPrepaidTransactions
        );
        const newDatas = await TransactionService.updateDatas(dataTransactions);
        const generateExcel = await ExcelHelper.writeInquiryPLNPrepaidToExcel(newDatas)
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=Inquiry.xlsx");
        return res.status(200).send(generateExcel);
    }

    static async payment(req, res, next) {
        const file = req.file;
        const datas = (await ExcelHelper.convertExcelDataToArray(file)).map(
            (data) => {
                if (
                    data["Order ID"] === undefined ||
                    data["Customer ID"] === undefined ||
                    data["Product Code"] === undefined
                ) {
                    throw new Error("Some rows is not valid");
                }
                data['id'] = data['Transaction ID'];
                data["order_id"] = data["Order ID"]["result"];
                data["customer_id"] = data["Customer ID"];
                data["product_code"] = data["Product Code"];
                delete data["Order ID"];
                delete data["Customer ID"];
                delete data["Product Code"];
                return data;
            }
        );
        const findDatas = await TransactionService.findByIds(datas);
        const dataTransactions = await PaymentService.processTransactions(findDatas, PaymentService.payPLNPrepaidTransactions.bind(PaymentService));
        const newDatas = await TransactionService.updateDatas(dataTransactions);
        const generateExcel = await ExcelHelper.writePaymentPLNPrepaidToExcel(newDatas);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=Payment.xlsx");
        return res.status(200).send(generateExcel);
    }
}

module.exports = PLNPrepaidController;
