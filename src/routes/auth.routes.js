const express = require("express");
const router = express.Router();

const { register,login,googleLogin } = require("../controllers/auth.controller");
const validate = require("../middlewares/validation.middleware");
const { registerSchema } = require("../validators/auth.validation");

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post("/login", login);

router.post("/google-login", googleLogin);  

module.exports = router;