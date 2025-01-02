const axios = require("axios");
const crypto = require("crypto");
const { PAYMENT_ACCOUNT_CONFIG, URL_CONFIG } = require("../config/constants");
const nodeCacheService = require("../services/node-cache.service");
const moment = require("moment");

class PaymentService {
    static async inqTransactions(payload) {
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
        const tarif_daya = doTransaction.data.detail.data7;
        const stan_meter = doTransaction.data.detail.data6;
        const periode = doTransaction.data.detail.data5;
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

    static async payTransactions(payload) {
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
        console.log(data);
        const doTransaction = await axios.post(URL_CONFIG.transactionUrl, data);
        console.log(doTransaction.data);
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

    static async processTransactions(insertDatas, transactionMethods) {
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
            const transactionPromises = batch.map(async (data) => {
                try {
                    return await transactionMethods(data);
                } catch (err) {
                    console.log(err);
                    return { error: true, message: err.message };
                }
            });

            // Wait for the batch to complete
            const batchResults = await Promise.allSettled(transactionPromises);

            console.log(batchResults);
            console.log("------------------------------------------------");

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

    static async inqPLNPrepaidTransactions(payload) {
        const data = {
            id: PAYMENT_ACCOUNT_CONFIG.partnerId,
            pin: PAYMENT_ACCOUNT_CONFIG.pin,
            user: PAYMENT_ACCOUNT_CONFIG.username,
            pass: PAYMENT_ACCOUNT_CONFIG.password,
            kodeproduk: "CPLNPRA",
            tujuan: payload.customer_id,
            idtrx: payload.id,
            jenis: 5,
        };
        const doTransaction = await axios.post(URL_CONFIG.transactionUrl, data);
        console.log(doTransaction.data);
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
        const base_bill = Number(payload.product_code.split("PLNFR")[1] + "000");
        const admin_fee = payload.admin_fee;
        const price = +base_bill + +admin_fee;
        const no_meter = doTransaction.data.detail.data6;
        const tarif_daya = doTransaction.data.detail.data7;

        return {
            id: payload.id,
            customer_id: payload.customer_id,
            product_code: payload.product_code,
            admin_fee,
            detail: {
                customer_name,
                base_bill,
                price,
                no_meter,
                tarif_daya,
            },
            is_inquiry: true,
            information: "Success Inquiry",
            payment_id: payload.createdAt.getTime() + payload.id,
        };
    }

    static async payPLNPrepaidTransactions(payload) {
        const data = {
            id: PAYMENT_ACCOUNT_CONFIG.partnerId,
            pin: PAYMENT_ACCOUNT_CONFIG.pin,
            user: PAYMENT_ACCOUNT_CONFIG.username,
            pass: PAYMENT_ACCOUNT_CONFIG.password,
            kodeproduk: payload.product_code,
            tujuan: payload.customer_id,
            idtrx: payload.payment_id,
            jenis: 1,
        };
        const doTransaction = await axios.post(URL_CONFIG.transactionUrl, data);
        if (!doTransaction.data) {
            return {
                id: payload.id,
                payment_id: payload.payment_id,
                customer_id: payload.customer_id,
                product_code: payload.product_code,
                error: true,
                information: "Gagal Bayar",
            };
        }
        if (doTransaction.data.rc != "68") {
            return {
                id: payload.id,
                payment_id: payload.payment_id,
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

        if (finalStatusData.rc != '00') {
            return {
                id: payload.id,
                payment_id: payload.payment_id,
                customer_id: payload.customer_id,
                product_code: payload.product_code,
                error: true,
                information: finalStatusData.msg,
            };
        }

        const detailData = finalStatusData.sn;
        const sn = await this.findStringBetweenText(detailData, "/TOKEN:", "/PPN:");
        const tarif_daya = await this.findStringBetweenText(detailData, "/TARIFDAYA:", "/PLNREF:")
        const total_kwh = await this.findStringBetweenText(detailData, "/JUMLAHKWH:", "");
        const materai = await this.findStringBetweenText(detailData, "/MATERAI:", "/TOKEN:")
        const ppn = await this.findStringBetweenText(detailData, "/PPN:", "/PPJ:")
        const ppj = await this.findStringBetweenText(detailData, "/PPJ:", "/ANGSURAN:")
        const angsuran = await this.findStringBetweenText(detailData, "/ANGSURAN:", "//RPTOKEN:");
        const rp_stroom = await this.findStringBetweenText(detailData, "/RPTOKEN:", "/JUMLAHKWH:");
        return {
            id: payload.id,
            customer_id: payload.customer_id,
            product_code: payload.product_code,
            detail: {
                ...payload.detail,
                sn,
                tarif_daya,
                total_kwh,
                materai,
                ppn,
                ppj,
                angsuran,
                rp_stroom
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
                    ...data
                };
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    }
}

module.exports = PaymentService;
