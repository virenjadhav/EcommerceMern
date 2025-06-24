class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `Error: ${message}`;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
    return {
      success: false,
      message: message,
    };
  }
}

module.exports = AppError;
