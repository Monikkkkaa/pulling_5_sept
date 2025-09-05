export function validate(schema) {
  return (req, _res, next) => {
    const toValidate = {
      body: req.body,
      params: req.params,
      query: req.query,
    }
    const { error, value } = schema.validate(toValidate, { abortEarly: false, allowUnknown: true })
    if (error) {
      return next(Object.assign(new Error("Validation failed"), { status: 400, details: error.details }))
    }
    req.body = value.body ?? req.body
    req.params = value.params ?? req.params
    req.query = value.query ?? req.query
    next()
  }
}
