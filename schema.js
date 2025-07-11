const Joi = require("joi");
const joi = require("joi");

module.exports.recipeSchema = Joi.object({
  name: Joi.string().required(),
  instructions: Joi.string().required(),
  time: Joi.number().required().min(0),
  image: Joi.string().allow("", null),
});

module.exports.reviewSchema = Joi.object({
  comment: Joi.string().required(),
  rating: Joi.number().required().min(1).max(5),
});
