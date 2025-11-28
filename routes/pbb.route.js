const PBBController = require("../controllers/pbb.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = require("express").Router();
const multer = require("multer");

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/inquiry",
  upload.single("file"),
  asyncHandler(PBBController.inquiry.bind(PBBController))
);

router.post(
  "/payment",
  upload.single("file"),
  asyncHandler(PBBController.payment.bind(PBBController))
);

router.post(
  "/history",
  upload.single("file"),
  asyncHandler(PBBController.historyPayment.bind(PBBController))
);

module.exports = router;
