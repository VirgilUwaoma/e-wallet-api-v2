const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const {
  registerUserValidation,
  loginUserValidation,
} = require("../utilities/validation");
const async = require("async");
const createError = require("http-errors");
const { issueToken } = require("../utilities/token");

function registerUser(req, res, next) {
  // Validate data before creating user
  const { error } = registerUserValidation(req.body);
  if (error) {
    const message = error.details[0].message;
    return res.status(400).json({ message });
  }

  async.waterfall(
    [
      async function () {
        emails = await User.searchByEmail(req.body.email);
        mobiles = await User.getByMobile(req.body.mobile_number);
        console.log(emails, mobiles);
        if (emails || mobiles) {
          throw createError(
            409,
            "user with email or mobile number already exists"
          );
        }
      },
      async function () {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        return hashedPassword;
      },
      async function (hashedPassword) {
        const newUser = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email.toLowerCase(),
          password: hashedPassword,
          mobile_number: req.body.mobile_number,
        };
        const walletId = uuidv4();
        const newWallet = {
          balance: 100.0,
          wallet_id: walletId,
        };
        createdNewUser = await User.createUser(newUser, newWallet);
        if (!createdNewUser) {
          throw createError(500, "user couldn't be added. try again");
        }
      },
      async function () {
        const user = User.getByMobile(req.body.mobile_number);
        return user;
      },
    ],
    function (err, result) {
      if (err) {
        return next(err);
      }
      return res.status(201).json({
        data: { url: `${process.env.BASE_URL}api/users/${result.id}` },
        message: "user added",
      });
    }
  );
}

async function loginUser(req, res, next) {
  const { error } = loginUserValidation(req.body);
  if (error) {
    const message = error.details[0].message;
    return res.status(400).json({ message });
  }

  async.waterfall(
    [
      async function () {
        const user = await User.getByEmail(req.body.email);
        isPasswordCorrect = user
          ? await bcrypt.compare(req.body.password, user.password)
          : false;
        if (!isPasswordCorrect) {
          throw createError(400, "incorrect email or password");
        }
        return user;
      },
      async function (user) {
        const payload = {
          id: user.id,
          full_name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          mobile_number: user.mobile_number,
        };
        const token = await issueToken(payload);
        user.password = undefined;
        return { token, user };
      },
    ],
    function (err, result) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        data: {
          token: result.token,
          user: {
            details: result.user,
            url: `${process.env.BASE_URL}api/users/${result.user.id}`,
          },
        },
        message: "user logged in",
      });
    }
  );
}

module.exports = {
  registerUser,
  loginUser,
};
