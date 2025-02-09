// user model mongoDB
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to send messages");
  }
});

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_picture: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  bio: {
    type: String,
  },
  followers: [String],
  following: [String],
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// static signup method
userSchema.statics.singup = async function (name, surname, email, password) {
  // validation
  if (!name || !surname || !email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const profile_picture = {
    public_id: "profile_pictures/default_avatar_rmhq6j",
    url: "https://res.cloudinary.com/dcwp4g10w/image/upload/v1668097379/profile_pictures/default_avatar_rmhq6j.png",
  };

  const user = await this.create({
    name,
    surname,
    email,
    password: hash,
    profile_picture,
  });

  // email verification async
  emailToken = jwt.sign({ _id: user._id }, process.env.MAIL_SECRET, {
    expiresIn: "1d",
  });

  const url = `${process.env.API_URL}/api/user/verify/${emailToken}`;

  await transporter.sendMail({
    from: `Mapple Krzysztof Wojtowicz <${process.env.MAIL_FROM}>`,
    to: user.email,
    subject: "Mapple Verify Email",
    html: `<h3>Mapple</h3><p>Please verify your email address</p><p><a href="${url}">verify here</a></p><p>This link will expire in 24 hours</p>`,
  });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email");
  }

  if (!user.verified) {
    throw Error("Please verify your email to login");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

// static send mail method
userSchema.statics.send = async function (user) {
  // email verification async
  console.log(user);

  emailToken = jwt.sign({ _id: user._id }, process.env.MAIL_SECRET, {
    expiresIn: "1d",
  });

  const url = `${process.env.API_URL}/api/user/verify/${emailToken}`;

  await transporter.sendMail({
    from: `Mapple Krzysztof Wojtowicz <${process.env.MAIL_FROM}>`,
    to: user.email,
    subject: "Mapple Verify Email",
    html: `<h3>Mapple</h3><p>Please verify your email address</p><p><a href="${url}">verify here</a></p><p>This link will expire in 24 hours</p>`,
  });
};

module.exports = mongoose.model("User", userSchema);
