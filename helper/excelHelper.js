const ExcelJs = require('exceljs');
const fs = require('fs/promises');

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
}

module.exports = ExcelHelper