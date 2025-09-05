import Joi from "joi";

export const createEventSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().allow("").max(2000).optional(),
    dateOptions: Joi.array()
      .items(Joi.object({ label: Joi.string().min(1).required() }))
      .min(1)
      .required(),
    poll: Joi.object({
      question: Joi.string().min(1).required(),
      options: Joi.array()
        .items(Joi.object({ label: Joi.string().min(1).required() }))
        .min(2)
        .required(),
    }).required(),
    participants: Joi.array().items(Joi.string().hex().length(24)).default([]),
  }),
});

export const updateEventSchema = Joi.object({
  params: Joi.object({ id: Joi.string().hex().length(24).required() }),
  body: Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    description: Joi.string().allow("").max(2000).optional(),
    dateOptions: Joi.array()
      .items(Joi.object({ label: Joi.string().min(1).required() }))
      .min(1)
      .optional(),
  }),
});

export const getByIdSchema = Joi.object({
  params: Joi.object({ id: Joi.string().hex().length(24).required() }),
});

export const inviteSchema = Joi.object({
  params: Joi.object({ id: Joi.string().hex().length(24).required() }),
  body: Joi.object({
    userIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  }),
});

export const voteSchema = Joi.object({
  params: Joi.object({ id: Joi.string().hex().length(24).required() }),
  body: Joi.object({
    optionId: Joi.string().hex().length(24).required(),
  }),
});
