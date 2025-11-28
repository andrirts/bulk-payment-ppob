const axios = require("axios");
const crypto = require("crypto");
const { PAYMENT_ACCOUNT_CONFIG, URL_CONFIG } = require("../config/constants");
const nodeCacheService = require("../services/node-cache.service");
const moment = require("moment");

class PaymentService {
  static async inqPLNPostpaidTransactions(payload, user) {
    const data = {
      id: user.partner_id,
      pin: user.pin,
      user: user.username,
      pass: user.password,
      kodeproduk: payload.product_code,
      tujuan: payload.customer_id,
      idtrx: payload.id,
      jenis: 5,
    };
    const hashedPin = await PaymentService.sha256(data.pin);
    const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
    const sign = await PaymentService.sha1(
      timestamp + data.id + hashedPin + data.kodeproduk + data.idtrx
    );

    const reqTrx = {
      clientreff: data.idtrx,
      customerno: data.tujuan,
      productcode: data.kodeproduk,
      type: data.jenis,
    };

    if (nodeCacheService.get(`${user.partner_id}:token`)) {
      user.token = nodeCacheService.get(`${user.partner_id}:token`);
    } else {
      const login = await PaymentService.login({
        username: data.user,
        password: data.pass,
      });
      const token = login.data.token;
      nodeCacheService.set(`${user.partner_id}:token`, token, 300);
      user.token = token;
    }
    const token = user.token;
    const doTransaction = await axios.post(URL_CONFIG.transactionUrl, reqTrx, {
      headers: {
        "Content-Type": "application/json",
        partnerid: data.id,
        pin: hashedPin,
        timestamp: timestamp,
        sign: sign,
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(doTransaction.data);
    if (!doTransaction.data) {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: "Gagal Inquiry",
      };
    }
    if (doTransaction.data.rc !== "00") {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: doTransaction.data.msg,
      };
    }
    const customer_name = doTransaction.data.detail.nama;
    const base_bill = doTransaction.data.detail.tagihan;
    const admin_fee = payload.admin_fee;
    const price = +base_bill + +admin_fee;
    const tarif_daya = doTransaction.data.detail.tarifDaya;
    const stan_meter = doTransaction.data.detail.stMeter;
    const periode = doTransaction.data.detail.blth;
    return {
      id: payload.id,
      customer_id: payload.customer_id,
      product_code: payload.product_code,
      detail: {
        customer_name,
        base_bill,
        admin_fee,
        price,
        tarif_daya,
        stan_meter,
        periode,
      },
      is_inquiry: true,
      information: "Success Inquiry",
      payment_id: payload.createdAt.getTime() + payload.id,
    };
  }

  static async payPLNPostpaidTransactions(payload, user) {
    const data = {
      id: user.partner_id,
      pin: user.pin,
      user: user.username,
      pass: user.password,
      kodeproduk: payload.product_code,
      tujuan: payload.customer_id,
      idtrx: payload.payment_id,
      jenis: 6,
    };
    // console.log(data);
    const hashedPin = await PaymentService.sha256(data.pin);
    const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
    const sign = await PaymentService.sha1(
      timestamp + data.id + hashedPin + data.kodeproduk + data.idtrx
    );

    const reqTrx = {
      clientreff: data.idtrx,
      customerno: data.tujuan,
      productcode: data.kodeproduk,
      type: data.jenis,
    };

    if (nodeCacheService.get(`${user.partner_id}:token`)) {
      user.token = nodeCacheService.get(`${user.partner_id}:token`);
    } else {
      const login = await PaymentService.login({
        username: data.user,
        password: data.pass,
      });
      const token = login.data.token;
      nodeCacheService.set(`${user.partner_id}:token`, token, 300);
      user.token = token;
    }
    const token = user.token;
    const doTransaction = await axios.post(URL_CONFIG.transactionUrl, reqTrx, {
      headers: {
        "Content-Type": "application/json",
        partnerid: data.id,
        pin: hashedPin,
        timestamp: timestamp,
        sign: sign,
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(doTransaction.data);
    if (!doTransaction.data) {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: "Gagal Inquiry",
      };
    }
    if (doTransaction.data.rc !== "00") {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: doTransaction.data.msg,
      };
    }
    const sn = doTransaction.data.sn;
    return {
      id: payload.id,
      payment_id: payload.payment_id,
      customer_id: payload.customer_id,
      product_code: payload.product_code,
      detail: {
        ...payload.detail,
        sn,
      },
      information: "Berhasil Bayar",
      payment_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
  }

  static async sha1(payload) {
    return crypto.createHash("sha1").update(payload).digest("hex");
  }

  static async sha256(payload) {
    return crypto.createHash("sha256").update(payload).digest("hex");
  }

  static async login(user) {
    const data = {
      username: user.username,
      password: user.password,
    };
    const login = await axios.post(URL_CONFIG.loginUrl, data);
    return login.data;
  }

  static async findStringBetweenText(str, startDelimiter, endDelimiter) {
    let regex;

    if (endDelimiter) {
      // Create a regex to capture between delimiters
      regex = new RegExp(`${startDelimiter}(.*?)${endDelimiter}`);
    } else {
      // Match everything after startDelimiter if no endDelimiter
      regex = new RegExp(`${startDelimiter}(.*)`);
    }

    // Use the regex to find the match
    const match = str.match(regex);

    // If a match is found, return the captured group
    if (match && match[1]) {
      return match[1].trim(); // Trim to remove any extra spaces
    } else {
      return null; // Return null if no match is found
    }
  }

  static async processTransactions(insertDatas, transactionMethods, user) {
    const batchSize = 10; // Number of transactions per batch
    const results = [];

    // Helper function to split data into chunks
    const chunkArray = (array, size) => {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    };

    // Split the input data into batches
    const batches = chunkArray(insertDatas, batchSize);

    for (const batch of batches) {
      // Process a batch
      // const { data } = await this.login(user);
      // user.token = data.token;
      const transactionPromises = batch.map(async (data) => {
        try {
          return await transactionMethods(data, user);
        } catch (err) {
          // console.log(err);
          return { error: true, message: err.message };
        }
      });

      // Wait for the batch to complete
      const batchResults = await Promise.allSettled(transactionPromises);

      // console.log(batchResults);
      // console.log("------------------------------------------------");

      // Collect results
      results.push(
        ...batchResults.map((result) => {
          if (result.status === "fulfilled") {
            return result.value; // Success response
          } else {
            return {
              error: true,
              message: result.reason.message,
              noPelanggan: result.reason?.tujuan || null, // Error response
            };
          }
        })
      );
    }

    return results;
  }

  static async inqPLNPrepaidTransactions(payload, user) {
    const data = {
      id: user.partner_id,
      pin: user.pin,
      user: user.username,
      pass: user.password,
      kodeproduk: payload.product_code,
      tujuan: payload.customer_id,
      idtrx: payload.id,
      jenis: 5,
    };

    const hashedPin = await PaymentService.sha256(user.pin);
    const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
    const sign = await PaymentService.sha1(
      timestamp + data.id + hashedPin + data.kodeproduk + data.idtrx
    );

    const reqTrx = {
      clientreff: data.idtrx,
      customerno: data.tujuan,
      productcode: data.kodeproduk,
      type: data.jenis,
    };

    if (nodeCacheService.get(`${user.partner_id}:token`)) {
      user.token = nodeCacheService.get(`${user.partner_id}:token`);
    } else {
      const login = await PaymentService.login({
        username: data.user,
        password: data.pass,
      });
      const token = login.data.token;
      nodeCacheService.set(`${user.partner_id}:token`, token, 300);
      user.token = token;
    }
    const token = user.token;
    const doTransaction = await axios.post(URL_CONFIG.transactionUrl, reqTrx, {
      headers: {
        "Content-Type": "application/json",
        partnerid: data.id,
        pin: hashedPin,
        timestamp: timestamp,
        sign: sign,
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(doTransaction.data);
    if (!doTransaction.data) {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: "Gagal Inquiry",
      };
    }
    if (doTransaction.data.rc !== "00") {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: doTransaction.data.msg,
      };
    }
    const customer_name = doTransaction.data.detail.nama;
    // const base_bill = Number(payload.product_code.split("PLNFR")[1] + "000");
    const base_bill = 50000;
    const admin_fee = payload.admin_fee;
    const price = +base_bill + +admin_fee;
    const tarif_daya = doTransaction.data.detail.tarifDaya;

    return {
      id: payload.id,
      customer_id: payload.customer_id,
      product_code: payload.product_code,
      admin_fee,
      detail: {
        customer_name,
        base_bill,
        price,
        tarif_daya,
      },
      is_inquiry: true,
      information: "Success Inquiry",
      payment_id: payload.createdAt.getTime() + payload.id,
    };
  }

  static async payPLNPrepaidTransactions(payload, user) {
    const data = {
      id: user.partner_id,
      pin: user.pin,
      user: user.username,
      pass: user.password,
      kodeproduk: payload.product_code,
      tujuan: payload.customer_id,
      idtrx: payload.payment_id,
      jenis: 6,
    };

    const hashedPin = await PaymentService.sha256(user.pin);
    const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
    const sign = await PaymentService.sha1(
      timestamp + data.id + hashedPin + data.kodeproduk + data.idtrx
    );

    const reqTrx = {
      clientreff: data.idtrx,
      customerno: data.tujuan,
      productcode: data.kodeproduk,
      type: data.jenis,
    };

    if (nodeCacheService.get(`${user.partner_id}:token`)) {
      user.token = nodeCacheService.get(`${user.partner_id}:token`);
    } else {
      const login = await PaymentService.login({
        username: data.user,
        password: data.pass,
      });
      const token = login.data.token;
      nodeCacheService.set(`${user.partner_id}:token`, token, 300);
      user.token = token;
    }
    const token = user.token;
    const doTransaction = await axios.post(URL_CONFIG.transactionUrl, reqTrx, {
      headers: {
        "Content-Type": "application/json",
        partnerid: data.id,
        pin: hashedPin,
        timestamp: timestamp,
        sign: sign,
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(doTransaction.data);
    if (!doTransaction.data) {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: "Gagal Inquiry",
      };
    }
    if (doTransaction.data.rc !== "00") {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: doTransaction.data.msg,
      };
    }

    nodeCacheService.set(data.idtrx, {
      ...doTransaction.data,
    });

    const finalStatusData = await this.getFinalStatusWithTimeout(data.idtrx);

    if (finalStatusData.rc != "00") {
      return {
        id: payload.id,
        payment_id: payload.payment_id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: finalStatusData.msg,
      };
    }

    const sn = finalStatusData.sn;
    const total_kwh = finalStatusData.detail.kwh;
    const materai = finalStatusData.detail.materai;
    const ppn = finalStatusData.detail.ppn;
    const ppj = finalStatusData.detail.ppj;
    const angsuran = finalStatusData.detail.angsuran;
    const rp_stroom = finalStatusData.detail.stroom;
    return {
      id: payload.id,
      customer_id: payload.customer_id,
      product_code: payload.product_code,
      detail: {
        ...payload.detail,
        sn,
        total_kwh,
        materai,
        ppn,
        ppj,
        angsuran,
        rp_stroom,
      },
      is_paid: true,
      information: "Success Payment",
      payment_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
  }

  static async getFinalStatusWithTimeout(requestId) {
    const startTime = Date.now();
    while (true) {
      const elapsedTime = Date.now() - startTime;
      const data = nodeCacheService.get(requestId);
      if (data.rc != "68" || elapsedTime > 10000) {
        return {
          ...data,
        };
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  static async payPrepaidTransactions(payload, user) {
    const data = {
      id: user.partner_id,
      pin: user.pin,
      user: user.username,
      pass: user.password,
      kodeproduk: payload.product_code,
      tujuan: payload.customer_id,
      idtrx: payload.id,
      jenis: 1,
    };

    const reqTrx = {
      clientreff: data.idtrx,
      customerno: data.tujuan,
      productcode: data.kodeproduk,
      type: data.jenis,
    };

    const partnerid = user.partner_id;
    const timestamps = moment().format("YYYY-MM-DD HH:mm:ss");
    const hashedPin = await this.sha256(user.pin);
    const sign = await this.sha1(
      timestamps + partnerid + hashedPin + payload.product_code + payload.id
    );

    if (nodeCacheService.get(`${user.partner_id}:token`)) {
      user.token = nodeCacheService.get(`${user.partner_id}:token`);
    } else {
      const login = await PaymentService.login({
        username: data.user,
        password: data.pass,
      });
      const token = login.data.token;
      nodeCacheService.set(`${user.partner_id}:token`, token, 300);
      user.token = token;
    }

    const doTransaction = await axios.post(URL_CONFIG.transactionUrl, reqTrx, {
      headers: {
        partnerid: partnerid,
        timestamp: timestamps,
        sign: sign,
        Authorization: "Bearer " + user.token,
      },
    });

    if (!doTransaction.data) {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: "Gagal Bayar",
      };
    }
    if (doTransaction.data.rc != "68") {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: doTransaction.data.msg,
      };
    }

    nodeCacheService.set(reqTrx.clientreff, {
      ...doTransaction.data,
    });

    const finalStatusData = await this.getFinalStatusWithTimeout(
      reqTrx.clientreff
    );

    if (finalStatusData.rc != "00") {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: finalStatusData.msg,
      };
    }
    const sn = finalStatusData.sn;
    return {
      id: payload.id,
      customer_id: payload.customer_id,
      product_code: payload.product_code,
      detail: {
        sn,
      },
      is_paid: true,
      information: "Success Payment",
      payment_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
  }

  static async inqPDAMTransactions(payload) {
    const data = {
      id: PAYMENT_ACCOUNT_CONFIG.partnerId,
      pin: PAYMENT_ACCOUNT_CONFIG.pin,
      user: PAYMENT_ACCOUNT_CONFIG.username,
      pass: PAYMENT_ACCOUNT_CONFIG.password,
      kodeproduk: payload.product_code,
      tujuan: payload.customer_id,
      idtrx: payload.id,
      jenis: 5,
    };
    const doTransaction = await axios.post(URL_CONFIG.transactionUrl, data);
    // console.log(doTransaction.data);
    if (!doTransaction.data) {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: "Gagal Inquiry",
      };
    }
    if (doTransaction.data.rc !== "00") {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: doTransaction.data.msg,
      };
    }
    const customer_name = doTransaction.data.detail.nama;
    const base_bill = doTransaction.data.detail.tagihan;
    const admin_fee = doTransaction.data.detail.admin;
    const price = +base_bill + +admin_fee;
    const stan_meter = doTransaction.data.detail.stMeter;
    const periode = doTransaction.data.detail.periode;
    return {
      id: payload.id,
      customer_id: payload.customer_id,
      product_code: payload.product_code,
      admin_fee,
      detail: {
        customer_name,
        base_bill,
        price,
        stan_meter,
        periode,
      },
      is_inquiry: true,
      information: "Success Inquiry",
      payment_id: payload.createdAt.getTime() + payload.id,
    };
  }

  static async payPDAMTransactions(payload) {
    const data = {
      id: PAYMENT_ACCOUNT_CONFIG.partnerId,
      pin: PAYMENT_ACCOUNT_CONFIG.pin,
      user: PAYMENT_ACCOUNT_CONFIG.username,
      pass: PAYMENT_ACCOUNT_CONFIG.password,
      kodeproduk: payload.product_code,
      tujuan: payload.customer_id,
      idtrx: payload.payment_id,
      jenis: 6,
    };
    // console.log(data);
    const doTransaction = await axios.post(URL_CONFIG.transactionUrl, data);
    // console.log(doTransaction.data);
    if (!doTransaction.data) {
      return {
        id: payload.id,
        payment_id: payload.payment_id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: doTransaction.data.msg,
      };
    }
    if (doTransaction.data.rc !== "00") {
      return {
        id: payload.id,
        payment_id: payload.payment_id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: doTransaction.data.msg,
      };
    }
    const sn = doTransaction.data.sn;
    return {
      id: payload.id,
      payment_id: payload.payment_id,
      customer_id: payload.customer_id,
      product_code: payload.product_code,
      detail: {
        ...payload.detail,
        sn,
      },
      payment_date: moment().format("YYYY-MM-DD HH:mm:ss"),
      information: "Berhasil Bayar",
    };
  }

  static async inqPostpaidTransactions(payload) {
    const data = {
      id: PAYMENT_ACCOUNT_CONFIG.partnerId,
      pin: PAYMENT_ACCOUNT_CONFIG.pin,
      user: PAYMENT_ACCOUNT_CONFIG.username,
      pass: PAYMENT_ACCOUNT_CONFIG.password,
      kodeproduk: payload.product_code,
      tujuan: payload.customer_id,
      idtrx: payload.id,
      jenis: 5,
    };
    const doTransaction = await axios.post(URL_CONFIG.transactionUrl, data);
    // console.log(doTransaction.data);
    if (!doTransaction.data) {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: "Gagal Inquiry",
      };
    }
    if (doTransaction.data.rc !== "00") {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: doTransaction.data.msg,
      };
    }
    const customer_name = doTransaction.data.detail.data4;
    const base_bill = doTransaction.data.detail.data1;
    const admin_fee = payload.admin_fee;
    const price = +base_bill + +admin_fee;
    const periode = doTransaction.data.detail.data5;
    // console.log(doTransaction.data);
    return {
      id: payload.id,
      customer_id: payload.customer_id,
      product_code: payload.product_code,
      admin_fee,
      detail: {
        customer_name,
        base_bill,
        price,
        periode,
      },
      is_inquiry: true,
      information: "Success Inquiry",
      payment_id: payload.createdAt.getTime() + payload.id,
    };
  }

  static async payPostpaidTransactions(payload) {
    const data = {
      id: PAYMENT_ACCOUNT_CONFIG.partnerId,
      pin: PAYMENT_ACCOUNT_CONFIG.pin,
      user: PAYMENT_ACCOUNT_CONFIG.username,
      pass: PAYMENT_ACCOUNT_CONFIG.password,
      kodeproduk: payload.product_code,
      tujuan: payload.customer_id,
      idtrx: payload.payment_id,
      jenis: 6,
    };
    // console.log(data);
    const doTransaction = await axios.post(URL_CONFIG.transactionUrl, data);
    // console.log(doTransaction.data);
    if (!doTransaction.data) {
      return {
        id: payload.id,
        payment_id: payload.payment_id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: doTransaction.data.msg,
      };
    }
    if (doTransaction.data.rc !== "00") {
      return {
        id: payload.id,
        payment_id: payload.payment_id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: doTransaction.data.msg,
      };
    }
    const sn = doTransaction.data.sn;
    return {
      id: payload.id,
      payment_id: payload.payment_id,
      customer_id: payload.customer_id,
      product_code: payload.product_code,
      detail: {
        ...payload.detail,
        sn,
      },
      information: "Berhasil Bayar",
    };
  }

  static async inqPBBTransactions(payload, user) {
    const data = {
      id: user.partner_id,
      pin: user.pin,
      user: user.username,
      pass: user.password,
      kodeproduk: payload.product_code,
      tujuan: payload.customer_id,
      idtrx: payload.id,
      year: payload.year,
      jenis: 5,
    };

    const hashedPin = await PaymentService.sha256(user.pin);
    const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
    const sign = await PaymentService.sha1(
      timestamp + data.id + hashedPin + data.kodeproduk + data.idtrx
    );

    const reqTrx = {
      clientreff: data.idtrx,
      customerno: data.tujuan,
      productcode: data.kodeproduk,
      type: data.jenis,
      additionalid: data.year,
    };
    if (nodeCacheService.get(`${user.partner_id}:token`)) {
      user.token = nodeCacheService.get(`${user.partner_id}:token`);
    } else {
      const login = await PaymentService.login({
        username: data.user,
        password: data.pass,
      });
      const token = login.data.token;
      nodeCacheService.set(`${user.partner_id}:token`, token, 300);
      user.token = token;
    }
    const token = user.token;

    const doTransaction = await axios.post(URL_CONFIG.transactionUrl, reqTrx, {
      headers: {
        "Content-Type": "application/json",
        partnerid: data.id,
        pin: hashedPin,
        timestamp: timestamp,
        sign: sign,
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(doTransaction.data);
    if (!doTransaction.data) {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: "Gagal Inquiry",
      };
    }
    if (doTransaction.data.rc !== "00") {
      return {
        id: payload.id,
        customer_id: payload.customer_id,
        product_code: payload.product_code,
        error: true,
        information: doTransaction.data.msg,
      };
    }
    const customer_name = doTransaction.data.detail.nama;
    const base_bill = doTransaction.data.detail.tagihan;
    const admin_fee = doTransaction.data.detail.admin;
    const price = doTransaction.data.detail.totalTagihan;
    const alamat = doTransaction.data.detail.alamat;
    const tahun_pajak = data.year;
    return {
      id: payload.id,
      customer_id: payload.customer_id,
      product_code: payload.product_code,
      detail: {
        customer_name,
        base_bill,
        admin_fee,
        price,
        alamat,
        tahun_pajak,
      },
      is_inquiry: true,
      information: "Success Inquiry",
      payment_id: payload.createdAt.getTime() + payload.id,
    };
  }
}

module.exports = PaymentService;
