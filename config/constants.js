const PAYMENT_ACCOUNT_CONFIG = {
    username: process.env.PAYMENT_USERNAME,
    password: process.env.PAYMENT_PASSWORD,
    pin: process.env.PAYMENT_PIN,
    partnerId: process.env.PAYMENT_PARTNER_ID
}

const DB_CONFIG = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}

const URL_CONFIG = {
    loginUrl: process.env.LOGIN_URL,
    transactionUrl: process.env.TRANSACTION_URL
}

module.exports = {
    PAYMENT_ACCOUNT_CONFIG,
    DB_CONFIG,
    URL_CONFIG
}