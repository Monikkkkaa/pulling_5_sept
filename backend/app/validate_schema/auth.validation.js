import Joi from "joi";

export const authSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
  }),
});
