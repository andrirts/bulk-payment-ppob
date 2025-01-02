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
            const detail = data.detail;
            const transaction_id = data.id;
            const customer_id = data.customer_id;
            const order_id = data.order_id;
            const product_code = data.product_code;
            const operator = data.operator;
            const base_bill = detail.base_bill;
            const admin_fee = detail.admin_fee;
            const price = detail.price;
            const customer_name = detail.customer_name;
            const stan_meter = detail.stan_meter;
            const periode = detail.periode;
            const tarif_daya = detail.tarif_daya;
            const keterangan = data.information;
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
            const detail = data.detail;
            const transaction_id = data.payment_id;
            const customer_id = data.customer_id;
            const order_id = data.order_id;
            const product_code = data.product_code;
            const operator = data.operator;
            const admin_fee = data.admin_fee;
            const base_bill = detail.base_bill;
            const price = detail.price;
            const customer_name = detail.customer_name;
            const stan_meter = detail.stan_meter;
            const periode = detail.periode;
            const tarif_daya = detail.tarif_daya;
            const keterangan = data.information;
            const sn = detail.sn
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

    static async writeInquiryPLNPrepaidToExcel(datas) {
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
            { header: 'Tarif/Daya', key: 'tarif_daya', width: 10 },
            { header: 'Keterangan', key: 'keterangan', width: 10 },
        ]

        for (const data of datas) {
            const detail = data.detail;
            const transaction_id = data.id;
            const customer_id = data.customer_id;
            const order_id = data.order_id;
            const product_code = data.product_code;
            const admin_fee = data.admin_fee;
            const operator = data.operator;
            const base_bill = detail ? detail.base_bill : 0;
            const price = detail ? detail.price : 0;
            const customer_name = detail ? detail.customer_name : "";
            const tarif_daya = detail ? detail.tarif_daya : "";
            const keterangan = data.information;
            worksheet.addRow({ transaction_id, customer_id, order_id, product_code, operator, base_bill, admin_fee, price, customer_name, keterangan, tarif_daya });
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

    static async writePaymentPLNPrepaidToExcel(datas) {
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet("Payment");
        worksheet.columns = [
            { header: 'Transaction ID', key: 'transaction_id', width: 10 },
            { header: 'Customer ID', key: 'customer_id', width: 10 },
            { header: 'Order ID', key: 'order_id', width: 10 },
            { header: 'Created Date', key: 'payment_date', width: 10 },
            { header: 'Product Code', key: 'product_code', width: 10 },
            { header: 'Operator', key: 'operator', width: 10 },
            { header: 'Base Bill', key: 'base_bill', width: 10 },
            { header: 'Admin Fee', key: 'admin_fee', width: 10 },
            { header: 'Price', key: 'price', width: 10 },
            { header: 'SN', key: 'sn', width: 10 },
            { header: 'Customer Name', key: 'customer_name', width: 10 },
            { header: 'Tarif/Daya', key: 'tarif_daya', width: 10 },
            { header: 'Total kWh', key: 'total_kwh', width: 10 },
            { header: 'Materai', key: 'materai', width: 10 },
            { header: 'PPN', key: 'ppn', width: 10 },
            { header: 'PPJ', key: 'ppj', width: 10 },
            { header: 'ANGSURAN', key: 'angsuran', width: 10 },
            { header: 'RP STROOM/TOKEN', key: 'rp_stroom', width: 10 },
            { header: 'Keterangan', key: 'keterangan', width: 10 },
        ]

        for (const data of datas) {
            const detail = data.detail;
            const transaction_id = data.id;
            const customer_id = data.customer_id;
            const order_id = data.order_id;
            const product_code = data.product_code;
            const admin_fee = data.admin_fee;
            const operator = data.operator;
            const base_bill = detail ? detail.base_bill : 0;
            const price = detail ? detail.price : 0;
            const customer_name = detail ? detail.customer_name : "";
            const keterangan = data.information;
            const tarif_daya = detail ? detail.tarif_daya : "";
            const total_kwh = detail ? detail.total_kwh : 0;
            const materai = detail ? detail.materai : 0;
            const ppn = detail ? detail.ppn : 0;
            const ppj = detail ? detail.ppj : 0;
            const angsuran = detail ? detail.angsuran : 0;
            const rp_stroom = detail ? detail.rp_stroom : 0;
            const payment_date = data.payment_date;
            const sn = detail ? detail.sn : "";
            worksheet.addRow({
                transaction_id,
                customer_id,
                order_id,
                payment_date,
                product_code,
                operator,
                base_bill,
                admin_fee,
                price,
                sn,
                customer_name,
                tarif_daya,
                total_kwh,
                materai,
                ppn,
                ppj,
                angsuran,
                rp_stroom,
                keterangan
            })
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
