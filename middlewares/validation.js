const Joi = require("joi");

const schemaSignup = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.validateSignup = (req, res, next) => {
  const { error } = schemaSignup.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

exports.validateLogin = (req, res, next) => {
  const { error } = schemaLogin.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
