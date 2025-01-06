
const PrepaidController = require("../controllers/prepaid.controller");
const asyncHandler = require("../utils/asyncHandler");
const multer = require("multer");

const upload = multer({
    dest: "uploads/",
});

const router = require("express").Router();

router.post('/payment',
    upload.single("file"),
    asyncHandler(PrepaidController.payment.bind(PrepaidController))
);

router.post('/callback',
    asyncHandler(PrepaidController.callback.bind(PrepaidController))
);

module.exports = router;
