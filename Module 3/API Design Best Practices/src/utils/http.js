export const sendSuccess = (res, data, statusCode = 200, meta = null) => {
  const body = { data };
  if (meta) {
    body.meta = meta;
  }
  return res.status(statusCode).json(body);
};

export const sendError = (res, code, message, statusCode = 400) => {
  return res.status(statusCode).json({
    error: {
      code,
      message
    }
  });
};