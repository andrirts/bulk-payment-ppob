const ExcelHelper = require("../helper/excelHelper");
const PaymentService = require("../services/payment.service");
const TransactionService = require("../services/transaction.service");

class PDAMController {
    static async inquiry(req, res, next) {
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
                data["order_id"] = data["Order ID"];
                data["customer_id"] = data["Customer ID"];
                data["product_code"] = data["Product Code"];
                data["operator"] = "PDAM";
                delete data["Order ID"];
                delete data["Customer ID"];
                delete data["Product Code"];
                return data;
            }
        );
        const insertedDatas = await TransactionService.insertDatas(datas);
        const dataTransactions = await PaymentService.processTransactions(
            insertedDatas,
            PaymentService.inqPDAMTransactions
        );
        const newDatas = await TransactionService.updateDatas(dataTransactions);
        const generateExcel = await ExcelHelper.writeInquiryPDAMToExcel(newDatas)
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
                    data["Transaction ID"] === undefined ||
                    data["Order ID"] === undefined ||
                    data["Customer ID"] === undefined ||
                    data["Product Code"] === undefined
                ) {
                    throw new Error("Some rows is not valid");
                }
                data["id"] = data["Transaction ID"];
                data["order_id"] = data["Order ID"];
                data["customer_id"] = data["Customer ID"];
                data["product_code"] = data["Product Code"];
                delete data["Transaction ID"];
                delete data["Order ID"];
                delete data["Customer ID"];
                delete data["Product Code"];
                return data;
            }
        );
        const findDatas = await TransactionService.findByIds(datas);
        const dataTransactions = await PaymentService.processTransactions(
            findDatas,
            PaymentService.payPDAMTransactions
        );

        const newDatas = await TransactionService.updateDatas(dataTransactions);
        const generateExcel = await ExcelHelper.writePaymentPDAMToExcel(newDatas);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=Payment.xlsx");
        return res.status(200).send(generateExcel);
    }
    static async historyPayment(req, res, next) {
        const file = req.file;
        const datas = (await ExcelHelper.convertExcelDataToArray(file)).map(
            (data) => {
                if (
                    data["Transaction ID"] === undefined ||
                    data["Order ID"] === undefined ||
                    data["Customer ID"] === undefined ||
                    data["Product Code"] === undefined
                ) {
                    throw new Error("Some rows is not valid");
                }
                data["id"] = data["Transaction ID"];
                data["order_id"] = data["Order ID"];
                data["customer_id"] = data["Customer ID"];
                data["product_code"] = data["Product Code"];
                delete data["Transaction ID"];
                delete data["Order ID"];
                delete data["Customer ID"];
                delete data["Product Code"];
                return data;
            }
        );
        const findDatas = await TransactionService.findByIds(datas);
        const generateExcel = await ExcelHelper.writePaymentPDAMToExcel(findDatas);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=History.xlsx");
        return res.status(200).send(generateExcel);
    }
}
module.exports = PDAMController