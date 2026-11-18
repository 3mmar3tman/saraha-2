
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate data
    if (!name || !email || !password) {
      return next(
        new AppError("All fields are required", 400)
      );
    }

    // 2. Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(
        new AppError("Email already exists", 409)
      );
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Generate OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // 5. Set OTP expiration (10 minutes)
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // 6. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    // 7. Send response
    return res.status(201).json({
      success: true,
      message: "Registration successful. Verify your email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate data
    if (!email || !password) {
      return next(
        new AppError("Email and password are required", 400)
      );
    }

    // 2. Find user
    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new AppError("Invalid email or password", 401)
      );
    }

    // 3. Compare password
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return next(
        new AppError("Invalid email or password", 401)
      );
    }

    // 4. Check email verification
    if (!user.isVerified) {
      return next(
        new AppError("Please verify your email first", 403)
      );
    }

    // 5. Success response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    return next(error);
  }
};



module.exports = { register, login };

