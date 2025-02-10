const PrepaidController = require("../controllers/prepaid.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");
const multer = require("multer");

const upload = multer({
  dest: "uploads/",
});

const router = require("express").Router();

router.post(
  "/payment",
  upload.single("file"),
  asyncHandler(AuthMiddleware.auth),
  asyncHandler(PrepaidController.payment.bind(PrepaidController))
);

router.post(
  "/callback",
  asyncHandler(PrepaidController.callback.bind(PrepaidController))
);

module.exports = router;
