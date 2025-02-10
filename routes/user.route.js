const UserController = require("../controllers/user.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = require("express").Router();

router.post(
  "/register",
  asyncHandler(UserController.register.bind(UserController))
);

module.exports = router;
