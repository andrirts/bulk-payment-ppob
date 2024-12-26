
const PrepaidController = require("../controllers/prepaid.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = require("express").Router();

router.post('/payment',
    asyncHandler(PrepaidController.transactions.bind(PrepaidController))
);

router.post('/callback',
    asyncHandler(PrepaidController.callback.bind(PrepaidController))
);

module.exports = router;
