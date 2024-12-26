const axios = require("axios");

async function callback() {
    const dataCallback = {
        idtrx: '148741',
        reffid: '2',
        rc: '00',
        kode: 'PLNFR500',
        tujuan: '521031296570',
        harga: 502900,
        sn: "NOMETER:32028946823/ID PELANGGAN:521031296570/NAMA:PR PERWITA REGENCY/TARIFDAYA:B1/3500VA/PLNREF:2412200935213505/RP BAYAR:500000/MATERAI:0/TOKEN:3689-4848-2718-1021-9956/PPN:0/PPJ:37038/ANGSURAN:0//RPTOKEN:462962/JUMLAHKWH:420.9",
        msg: "REFF#2 Trx PLNFR500.521031296570 BERHASIL,Harga: 502.900 SN: NOMETER:32028946823/ID PELANGGAN:521031296570/NAMA:PR PERWITA REGENCY/TARIFDAYA:B1/3500VA/PLNREF:2412200935213505/RP BAYAR:500000/MATERAI:0/TOKEN:3689-4848-2718-1021-9956/PPN:0/PPJ:37038/ANGSURAN:0//RPTOKEN:462962/JUMLAHKWH:420.9 Sisa Saldo: 532.700 - 502.900 = 29.800 @12/20/2024 9:35:23 AM"
    }
    const dataCallback2 = { ...dataCallback, reffid: '3' };
    const urlCallback = 'https://5d87-103-165-131-106.ngrok-free.app/prepaid/callback';

    await axios.post(urlCallback, dataCallback);
    await axios.post(urlCallback, dataCallback2);
    // console.log(doTransaction.data);
}

(async () => await callback())();

