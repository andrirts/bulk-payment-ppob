const plnPascaRouter = require("./pln-pasca.route");
const plnPrepaidRouter = require("./pln-prepaid.route");

const router = require("express").Router();

router.use("/pln-pasca", plnPascaRouter);

router.use("/pln-prepaid", plnPrepaidRouter);

module.exports = router;
