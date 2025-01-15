const PDAMController = require("../controllers/pdam.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = require("express").Router();
const multer = require("multer");

const upload = multer({
    dest: "uploads/"
})

router.post('/inquiry',
    upload.single("file"),
    asyncHandler(PDAMController.inquiry.bind(PDAMController)));

router.post('/payment',
    upload.single("file"),
    asyncHandler(PDAMController.payment.bind(PDAMController)));

router.post('/history',
    upload.single("file"),
    asyncHandler(PDAMController.historyPayment.bind(PDAMController)));

module.exports = router;