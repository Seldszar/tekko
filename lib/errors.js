/**
 * A base error.
 * @private
 * @extends Error
 * @param {...any} params the parameters
 */
class BaseError extends Error {
  constructor(...params) {
    super(...params);

    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.defineProperty(this, "name", {
      value: this.constructor.name,
    });
  }
}

/**
 * A parse error.
 * @extends BaseError
 */
class ParseError extends BaseError {}

/**
 * A format error.
 * @extends BaseError
 */
class FormatError extends BaseError {}

exports.ParseError = ParseError;
exports.FormatError = FormatError;
