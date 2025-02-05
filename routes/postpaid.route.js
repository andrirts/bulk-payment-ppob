const PostpaidController = require("../controllers/postpaid.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = require("express").Router();
const multer = require("multer");

const upload = multer({
    dest: "uploads/"
})

router.post('/inquiry',
    upload.single("file"),
    asyncHandler(PostpaidController.inquiry.bind(PostpaidController)));

router.post('/payment',
    upload.single("file"),
    asyncHandler(PostpaidController.payment.bind(PostpaidController)));

// router.post('/history',
//     upload.single("file"),
//     asyncHandler(PostpaidController.historyPayment.bind(PostpaidController)));

module.exports = router;