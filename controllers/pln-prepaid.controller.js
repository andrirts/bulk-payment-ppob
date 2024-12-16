class PLNPrepaidController {

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
                data["product_code"] = "CPLNPRA";
                data["operator"] = "PLN TOKEN"
                delete data["Order ID"];
                delete data["Customer ID"];
                delete data["Product Code"];
                return data;
            }
        );
    }

}

module.exports = PLNPrepaidController;