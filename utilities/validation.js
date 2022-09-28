const Joi = require("joi");

function registerUserValidation(data) {
  const schema = Joi.object({
    first_name: Joi.string().min(6).required(),
    last_name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    mobile_number: Joi.string().min(6).required(),
  });
  return schema.validate(data);
}

function loginUserValidation(data) {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
}

function debitValidation(data) {
  const schema = Joi.object({
    amount: Joi.number().min(0).precision(2).positive().required(),
  });
  return schema.validate(data);
}

function creditValidation(data) {
  const schema = Joi.object({
    amount: Joi.number().min(0).precision(2).positive().required(),
  });
  return schema.validate(data);
}

function transferValidation(data) {
  const schema = Joi.object({
    amount: Joi.number().min(0).precision(2).positive().required(),
    receiver: Joi.string().min(10).required(),
  });
  return schema.validate(data);
}

module.exports = {
  registerUserValidation,
  loginUserValidation,
  debitValidation,
  creditValidation,
  transferValidation,
};
