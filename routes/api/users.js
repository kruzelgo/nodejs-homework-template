const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const {
  validateSignup,
  validateLogin,
} = require("../../middlewares/validation");
const auth = require("../../middlewares/auth");

router.post("/signup", validateSignup, userController.signup);
router.post("/login", validateLogin, userController.login);
router.get("/logout", auth, userController.logout);
router.get("/current", auth, userController.getCurrentUser);

module.exports = router;
