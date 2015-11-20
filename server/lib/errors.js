export class BaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

export class InvalidArgumentsError extends BaseError {
  constructor(message) {
    super(message);
  }
}

export class UnenoughPermissionError extends BaseError {
  constructor(message) {
    super(message);
  }
}
