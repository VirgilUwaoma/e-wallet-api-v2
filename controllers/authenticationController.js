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
        emails = await User.getByEmail(req.body.email);
        mobiles = await User.getByEmail(req.body.mobile_number);
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
        const newWallet = {
          balance: 100.0,
          wallet_id: uuidv4(),
        };
        createdNewUser = await User.createUser(newUser, newWallet);
        if (createdNewUser) {
          return {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email.toLowerCase(),
            mobile_number: req.body.mobile_number,
            wallet_id: uuidv4(),
          };
        } else {
          throw createError(500, "user couldn't be added. try again");
        }
      },
    ],
    function (err, result) {
      if (err) {
        return next(err);
      }
      return res.status(201).json({ data: result, message: "user added" });
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
        passwordCorrect = user
          ? await bcrypt.compare(req.body.password, user.password)
          : false;
        if (!passwordCorrect) {
          throw createError(400, "incorrect email or password");
        }
        return user;
      },
      async function (user) {
        const payload = {
          id: user.id,
          email: user.email,
          mobile_number: user.mobile_number,
        };
        const token = await issueToken(payload);
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
            id: result.user.id,
            first_name: result.user.first_name,
            last_name: result.user.last_name,
            email: result.user.email,
            mobile_number: result.user.mobile_number,
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
