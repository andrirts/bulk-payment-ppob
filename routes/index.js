const plnPascaRouter = require("./pln-pasca.route");
const plnPrepaidRouter = require("./pln-prepaid.route");
const prepaidRouter = require("./prepaid.route");
const pdamRouter = require("./pdam.route")
const postpaidRouter = require('./postpaid.route')

const router = require("express").Router();

router.use("/pln-pasca", plnPascaRouter);

router.use("/pln-prepaid", plnPrepaidRouter);

router.use("/prepaid", prepaidRouter);

router.use("/pdam", pdamRouter)

router.use('/postpaid', postpaidRouter)

module.exports = router;
