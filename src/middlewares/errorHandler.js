import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../infra/error.js";

// eslint-disable-next-line no-unused-vars
function onErrorHandler(err, req, res, next) {
  console.error(err);

  if (
    err instanceof ValidationError ||
    err instanceof NotFoundError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError
  ) {
    return res.status(err.statusCode).json(err);
  }

  const publicErrorObject = new InternalServerError({
    cause: err,
  });

  res.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const errorHandler = {
  onErrorHandler,
  asyncHandler,
};

export default errorHandler;
