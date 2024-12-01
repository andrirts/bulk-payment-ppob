const axios = require('axios');
const crypto = require('crypto');
const { PAYMENT_ACCOUNT_CONFIG, URL_CONFIG } = require('../config/constants');
const moment = require('moment');

class PaymentService {

    static async transactions(payload) {
        const pin = await this.sha256(PAYMENT_ACCOUNT_CONFIG.pin);
        const data = {
            clientreff: payload.id,
            customerno: payload.customer_id,
            productcode: payload.product_code,
            type: 5
        }
        const partnerId = PAYMENT_ACCOUNT_CONFIG.partnerId;
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        const sign = await this.sha1(timestamp + partnerId + pin + data.productcode + data.clientreff);
        // console.log("Timestamp", timestamp);
        // console.log("parter id", partnerId);
        // console.log("Hashed pin", pin);
        // console.log("pin", PAYMENT_ACCOUNT_CONFIG.pin);
        // console.log("product Code", data.productcode);
        // console.log("client reff", data.clientreff);
        // console.log("No tujuan", data.customerno);
        // console.log("sign", sign);
        const login = await this.login();

        const transactions = await axios.post(URL_CONFIG.transactionUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                'partnerid': partnerId,
                'timestamp': timestamp,
                'sign': sign,
                'Authorization': `Bearer ${login.data.token}`
            }
        });
        // console.log(transactions ? transactions.data : transactions);
        return transactions.data
    }

    static async sha1(payload) {
        return crypto.createHash('sha1').update(payload).digest('hex');
    }

    static async sha256(payload) {
        return crypto.createHash('sha256').update(payload).digest('hex');
    }

    static async login() {
        const username = PAYMENT_ACCOUNT_CONFIG.username;
        const password = PAYMENT_ACCOUNT_CONFIG.password;

        const data = {
            username,
            password
        }
        const login = await axios.post(URL_CONFIG.loginUrl, data);
        return login.data
    }

}

module.exports = PaymentService