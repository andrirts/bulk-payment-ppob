const ExcelJs = require("exceljs");
const fs = require("fs/promises");
const moment = require('moment')

class ExcelHelper {
    static async convertExcelDataToArray(file) {
        const datas = [];
        const workbook = new ExcelJs.Workbook();
        await workbook.xlsx.readFile(file.path);
        const worksheet = workbook.getWorksheet(1);

        const headerRow = worksheet.getRow(1).values.slice(1);
        worksheet.eachRow(function (row, rowNumber) {
            if (rowNumber > 1) {
                const data = {};
                row.eachCell(function (cell, colNumber) {
                    const headerKey = headerRow[colNumber - 1];
                    data[headerKey] = cell.value;
                });
                datas.push(data);
            }
        });
        await fs.unlink(file.path);
        return datas;
    }

    static async writeInquiryPLNToExcel(datas) {
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet("Inquiry");
        worksheet.columns = [
            { header: 'Transaction ID', key: 'transaction_id', width: 10 },
            { header: 'Customer ID', key: 'customer_id', width: 10 },
            { header: 'Order ID', key: 'order_id', width: 10 },
            { header: 'Product Code', key: 'product_code', width: 10 },
            { header: 'Operator', key: 'operator', width: 10 },
            { header: 'Base Bill', key: 'base_bill', width: 10 },
            { header: 'Admin Fee', key: 'admin_fee', width: 10 },
            { header: 'Price', key: 'price', width: 10 },
            { header: 'Customer Name', key: 'customer_name', width: 10 },
            { header: 'Stan Meter', key: 'stan_meter', width: 10 },
            { header: 'Periode', key: 'periode', width: 10 },
            { header: 'Tarif / Daya', key: 'tarif_daya', width: 10 },
            { header: 'Keterangan', key: 'keterangan', width: 10 },
        ]

        for (const data of datas) {
            const transaction_id = data.id;
            const customer_id = data.customer_id;
            const order_id = data.order_id;
            const product_code = data.product_code;
            const operator = data.operator;
            const base_bill = data.base_bill;
            const admin_fee = data.admin_fee;
            const price = data.price;
            const customer_name = data.customer_name;
            const stan_meter = data.stan_meter;
            const periode = data.periode;
            const tarif_daya = data.tarif_daya;
            const keterangan = data.keterangan;
            worksheet.addRow({ transaction_id, customer_id, order_id, product_code, operator, base_bill, admin_fee, price, customer_name, stan_meter, periode, tarif_daya, keterangan });
        }
        worksheet.getRow(1).font = { bold: true };
        worksheet.views = [
            {
                state: 'frozen', ySplit: 1
            }
        ]
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    static async writePaymentPLNToExcel(datas) {
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet("Inquiry");
        worksheet.columns = [
            { header: 'Transaction ID', key: 'transaction_id', width: 10 },
            { header: 'Customer ID', key: 'customer_id', width: 10 },
            { header: 'Order ID', key: 'order_id', width: 10 },
            { header: 'Product Code', key: 'product_code', width: 10 },
            { header: 'Operator', key: 'operator', width: 10 },
            { header: 'Base Bill', key: 'base_bill', width: 10 },
            { header: 'Admin Fee', key: 'admin_fee', width: 10 },
            { header: 'Price', key: 'price', width: 10 },
            { header: 'Customer Name', key: 'customer_name', width: 10 },
            { header: 'Stan Meter', key: 'stan_meter', width: 10 },
            { header: 'Periode', key: 'periode', width: 10 },
            { header: 'Tarif / Daya', key: 'tarif_daya', width: 10 },
            { header: 'Keterangan', key: 'keterangan', width: 10 },
            { header: 'Serial Number', key: 'sn', width: 10 },
            { header: 'Payment Date', key: 'payment_date', width: 10 },
        ]

        for (const data of datas) {
            const transaction_id = data.payment_id;
            const customer_id = data.customer_id;
            const order_id = data.order_id;
            const product_code = data.product_code;
            const operator = data.operator;
            const base_bill = data.base_bill;
            const admin_fee = data.admin_fee;
            const price = data.price;
            const customer_name = data.customer_name;
            const stan_meter = data.stan_meter;
            const periode = data.periode;
            const tarif_daya = data.tarif_daya;
            const keterangan = data.keterangan;
            const sn = data.sn
            const payment_date = moment(data.payment_date).format("YYYY-MM-DD HH:mm:ss")
            worksheet.addRow({ transaction_id, customer_id, order_id, product_code, operator, base_bill, admin_fee, price, customer_name, stan_meter, periode, tarif_daya, keterangan, sn, payment_date });
        }
        worksheet.getRow(1).font = { bold: true };
        worksheet.views = [
            {
                state: 'frozen', ySplit: 1
            }
        ]
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }
}

module.exports = ExcelHelper;
