class AppError extends Error {
  constructor(message, statusCodes) {
    super(message);

    this.statusCodes = statusCodes;
    this.status = `${statusCodes}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
