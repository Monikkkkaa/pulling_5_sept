export function notFoundHandler(_req, res, _next) {
  res.status(404).json({ error: "Not Found" })
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500
  if (status >= 500) {
    console.error("[error]", err)
  }
  res.status(status).json({
    error: err.message || "Internal Server Error",
    details: err.details || undefined,
  })
}
