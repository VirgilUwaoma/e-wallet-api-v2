const User = require("../models/User");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const {
  registerUserValidation,
  loginUserValidation,
} = require("../utilities/validation");
const async = require("async");
const createError = require("http-errors");

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
        if (emails.length > 0 || mobiles.lenght > 0) {
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
        console.log(createdNewUser);
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

async function loginUser(req, res) {}

module.exports = {
  registerUser,
  loginUser,
};
