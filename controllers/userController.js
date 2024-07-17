const jwt = require("jsonwebtoken");
const User = require("../models/user");
const path = require("path");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const gravatar = require("gravatar");

const signup = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const avatarURL = req.file
      ? `/avatars/${req.file.filename}`
      : gravatar.url(email, { s: "250", d: "retro" }, true);

    const newUser = new User({ email, avatarURL });
    newUser.setPassword(password);
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatarURL: newUser.avatarURL,
        },
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", code: 500, message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.validPassword(password)) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Email or password is wrong",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    user.token = token;
    await user.save();

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", code: 500, message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();
    res
      .status(204)
      .json({ status: "success", code: 204, message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", code: 500, message: "Internal server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const { email, subscription, avatarURL } = req.user;
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        email,
        subscription,
        avatarURL,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", code: 500, message: "Internal server error" });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "File is required" });
    }

    const { id } = req.user;
    const { path: temporaryPath, filename } = req.file;
    const fileExtension = path.extname(filename);

    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
      await fs.unlink(temporaryPath);
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Invalid image file" });
    }

    const newFileName = `${uuidv4()}${fileExtension}`;
    const newFilePath = path.join(__dirname, "../public/avatars", newFileName);

    await fs.rename(temporaryPath, newFilePath);
    const avatarURL = `/avatars/${newFileName}`;

    await User.findByIdAndUpdate(id, { avatarURL });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        avatarURL,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", code: 500, message: "Failed to update avatar" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  updateAvatar,
};
