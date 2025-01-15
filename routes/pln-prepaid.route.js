const PLNPrepaidController = require("../controllers/pln-prepaid.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = require("express").Router();
const multer = require("multer");

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/inquiry",
  upload.single("file"),
  asyncHandler(PLNPrepaidController.inquiry.bind(PLNPrepaidController))
);

router.post(
  "/payment",
  upload.single("file"),
  asyncHandler(PLNPrepaidController.payment.bind(PLNPrepaidController))
);

router.post('/history',
  upload.single("file"),
  asyncHandler(PLNPrepaidController.historyPayment.bind(PLNPrepaidController)));

module.exports = router;
