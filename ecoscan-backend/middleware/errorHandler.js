const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
};

module.exports = errorHandler;
