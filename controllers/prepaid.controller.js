const axios = require("axios");
const { PAYMENT_ACCOUNT_CONFIG, URL_CONFIG } = require("../config/constants");
const nodeCacheService = require("../services/node-cache.service");

class PrepaidController {
    static async transactions(req, res, next) {
        const data = {
            id: PAYMENT_ACCOUNT_CONFIG.partnerId,
            pin: PAYMENT_ACCOUNT_CONFIG.pin,
            user: PAYMENT_ACCOUNT_CONFIG.username,
            pass: PAYMENT_ACCOUNT_CONFIG.password,
            kodeproduk: "TDF500",
            tujuan: "087776424868",
            idtrx: 4,
            jenis: 1,
        };

        const doTransaction = await axios.post(URL_CONFIG.transactionUrl, data);
        if (!doTransaction.data) {
            return res.status(500).json({
                error: true,
                information: "Gagal Melakukan Pembayaran"
            })
        }
        if (doTransaction.data.rc != "68") {
            console.log(doTransaction.data);
            return res.status(500).json({
                error: true,
                information: doTransaction.data.msg
            })
        }
        nodeCacheService.set(data.idtrx, {
            idtrx: data.idtrx,
            status: "Pending"
        });
        const status = await this.getFinalStatusWithTimeout(data.idtrx);
        return res.status(200).json({
            status: true,
            information: status.information
        })

    }

    static async callback(req, res, next) {
        const data = req.body;
        const getRequestId = nodeCacheService.get(data.reffid)
        console.log(data);
        console.log(nodeCacheService.keys());
        console.log(getRequestId);
        if (!getRequestId) {
            return res.status(404).json({
                error: true,
                information: "Transaction ID Not Found"
            })
        }
        if (data.reffid != getRequestId.reffid) {
            return res.status(400).json({
                error: true,
                information: "Invalid Transaction ID"
            })
        }

        nodeCacheService.set(data.reffid, {
            ...data
        });
        console.log(nodeCacheService.keys());
        return res.status(200).json({
            status: true,
            information: "OK"
        })
    }

    static async getFinalStatusWithTimeout(requestId) {
        const startTime = Date.now();
        while (true) {
            const elapsedTime = Date.now() - startTime;
            const data = nodeCacheService.get(requestId);
            console.log(data);
            if (data.status != "Pending") {
                return {
                    id: requestId,
                    status: data.status,
                    information: data.information
                };
            }
            if (elapsedTime > 30000) {
                return {
                    id: requestId,
                    status: "Pending",
                    information: "Transaction Timeout"
                }
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    }
}

module.exports = PrepaidController;