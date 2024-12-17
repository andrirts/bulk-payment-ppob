const ExcelHelper = require("../helper/excelHelper");
const PaymentService = require("../services/payment.service");
const PLNPrepaidService = require("../services/pln-prepaid.service");

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
    const insertedDatas = await PLNPrepaidService.insertDatas(datas);
    const dataTransactions = await PaymentService.processTransactions(
      insertedDatas,
      PaymentService.inqPLNPraTransactions
    );
    const newDatas = await PLNPrepaidService.updateDatas(dataTransactions);
    res.json(newDatas);
  }
}

module.exports = PLNPrepaidController;
