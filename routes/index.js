const PLNController = require("../controllers/pln.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = require("express").Router();
const multer = require("multer");

const upload = multer({
    dest: "uploads/"
})

router.post('/inquiry',
    upload.single("file"),
    asyncHandler(PLNController.inquiry.bind(PLNController)));

module.exports = router;