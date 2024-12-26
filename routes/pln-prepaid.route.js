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

// router.post('/payment',
//     upload.single("file"),
//     asyncHandler(PLNPascaController.payment.bind(PLNPascaController)));

// router.post('/history',
//     upload.single("file"),
//     asyncHandler(PLNPascaController.historyPayment.bind(PLNPascaController)));

module.exports = router;
