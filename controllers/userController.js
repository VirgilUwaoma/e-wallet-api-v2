const User = require("../models/User");
const createError = require("http-errors");
async function getUsers(req, res, next) {
  try {
    const users = await User.getUsers();
    if (users.length == 0) {
      return res.status(200).json({
        message: "no users, create one using the /api/auth/register endpoint",
      });
    }
    return res.status(200).json({
      data: { users },
    });
  } catch (error) {
    if (error) {
      return next(createError(500));
    }
  }
}

async function getUser(req, res, next) {
  try {
    const user = await User.getUser(req.params.id);

    if (user.length == 0) {
      return res.status(200).json({
        message: "no users, create one using the /api/auth/register endpoint",
      });
    }
    return res.status(200).json({
      data: { user: user[0] },
    });
  } catch (error) {
    console.error(error);
    if (error) {
      return next(createError(500));
    }
  }
}

module.exports = { getUsers, getUser };
