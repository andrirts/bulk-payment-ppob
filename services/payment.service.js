const axios = require("axios");
const crypto = require("crypto");
const { PAYMENT_ACCOUNT_CONFIG, URL_CONFIG } = require("../config/constants");
const moment = require("moment");

class PaymentService {
  // static async transactions(payload) {
  //     const pin = await this.sha256(PAYMENT_ACCOUNT_CONFIG.pin);
  //     const data = {
  //         clientreff: payload.id,
  //         customerno: payload.customer_id,
  //         productcode: payload.product_code,
  //         type: 5
  //     }
  //     const partnerId = PAYMENT_ACCOUNT_CONFIG.partnerId;
  //     const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  //     const sign = await this.sha1(timestamp + partnerId + pin + data.productcode + data.clientreff);
  //     // console.log("Timestamp", timestamp);
  //     // console.log("parter id", partnerId);
  //     // console.log("Hashed pin", pin);
  //     // console.log("pin", PAYMENT_ACCOUNT_CONFIG.pin);
  //     // console.log("product Code", data.productcode);
  //     // console.log("client reff", data.clientreff);
  //     // console.log("No tujuan", data.customerno);
  //     // console.log("sign", sign);
  //     const login = await this.login();

  //     const transactions = await axios.post(URL_CONFIG.transactionUrl, data, {
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'partnerid': partnerId,
  //             'timestamp': timestamp,
  //             'sign': sign,
  //             'Authorization': `Bearer ${login.data.token}`
  //         }
  //     });
  //     // console.log(transactions ? transactions.data : transactions);
  //     return transactions.data
  // }

  static async transactions(payload) {
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
    if (!doTransaction.data) {
      throw new Error(doTransaction.data.msg);
    }
    const name = await this.findStringBetweenText(
      doTransaction.data.msg,
      "NAMA:",
      "/TARIF DAYA"
    );
    const bill = await this.findStringBetweenText(
      doTransaction.data.msg,
      "TAGIHAN:RP",
      "/ADMIN"
    );
    const admin = await this.findStringBetweenText(
      doTransaction.data.msg,
      "ADMIN:RP",
      "/TOTAL"
    );
    const total = await this.findStringBetweenText(
      doTransaction.data.msg,
      "TOTAL:RP",
      ""
    );
    const power = await this.findStringBetweenText(
      doTransaction.data.msg,
      "TARIF DAYA:",
      "/REF:"
    );
    const stanMeter = await this.findStringBetweenText(
      doTransaction.data.msg,
      "ST METER:",
      "/NOMINAL POKOK:"
    );
    const periode = await this.findStringBetweenText(
      doTransaction.data.msg,
      "/BLTH:",
      "/ST METER:"
    );
    return {
      id: payload.id,
      customer_id: payload.customer_id,
      product_code: payload.product_code,
      operator: "PLN POSTPAID",
      customer_name: name,
      base_bill: bill,
      admin_fee: admin,
      price: total,
      tarif_daya: power,
      stan_meter: stanMeter,
      periode,
      is_inquiry: true,
    };
  }

  static async sha1(payload) {
    return crypto.createHash("sha1").update(payload).digest("hex");
  }

  static async sha256(payload) {
    return crypto.createHash("sha256").update(payload).digest("hex");
  }

  static async login() {
    const username = PAYMENT_ACCOUNT_CONFIG.username;
    const password = PAYMENT_ACCOUNT_CONFIG.password;

    const data = {
      username,
      password,
    };
    const login = await axios.post(URL_CONFIG.loginUrl, data);
    return login.data;
  }

  static async findStringBetweenText(text, startWord, endWord) {
    const startIndex = text.indexOf(startWord);
    const endIndex = text.indexOf(endWord, startIndex);
    if (startIndex !== -1 && endIndex !== -1) {
      return text.substring(startIndex + startWord.length, endIndex);
    } else {
      throw new Error(`String not found on text ${text}`);
    }
  }
}

module.exports = PaymentService;
