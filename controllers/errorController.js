module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCOde = err.statusCOde || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
