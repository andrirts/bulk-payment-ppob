const ExcelHelper = require("../helper/excelHelper");
const PLNPasca = require("../models/pln-pasca.model");
const PaymentService = require("../services/payment.service");
const PLNService = require("../services/pln-pasca.service");

class PLNPascaController {
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
                data["order_id"] = data["Order ID"]["result"];
                data["customer_id"] = data["Customer ID"];
                data["product_code"] = data["Product Code"];
                data["operator"] = "PLN POSTPAID";
                data['admin_fee'] = 2900
                delete data["Order ID"];
                delete data["Customer ID"];
                delete data["Product Code"];
                return data;
            }
        );
        // const validateDatas
        const insertedDatas = await PLNService.insertDatas(datas);
        const dataTransactions = await PaymentService.processTransactions(insertedDatas, PaymentService.inqTransactions);

        const newDatas = await PLNService.updateDatas(dataTransactions);
        const generateExcel = await ExcelHelper.writeInquiryPLNToExcel(newDatas);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Inquiry.xlsx');
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
        const findDatas = await PLNService.findByIds(datas);
        const dataTransactions = await PaymentService.processTransactions(findDatas, PaymentService.payTransactions);

        const newDatas = await PLNService.updateDatas(dataTransactions);
        const generateExcel = await ExcelHelper.writePaymentPLNToExcel(newDatas);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Payment.xlsx');
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
        const findDatas = await PLNService.findByIds(datas);
        const generateExcel = await ExcelHelper.writePaymentPLNToExcel(findDatas);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=History.xlsx');
        return res.status(200).send(generateExcel);

    }

    //   static async processTransactions(insertedDatas) {
    //     const datas = [];
    //     const errorDatas = [];
    //     for (const data of insertedDatas) {
    //       try {
    //         const transactions = await PaymentService.transactions(data);
    //         if (transactions.error) errorDatas.push(transactions);
    //         else datas.push(transactions);
    //       } catch (err) {
    //         errorDatas.push({ error: true, message: err.message });
    //       }
    //     }
    //     return [datas, errorDatas];
    //   }
}

module.exports = PLNPascaController;
