/**
 * A base error.
 * @param message the message
 */
abstract class BaseError extends Error {
  public constructor(message: string) {
    super(message);

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
 * A parsing error.
 */
export class ParseError extends BaseError {}

/**
 * A formatting error.
 */
export class FormatError extends BaseError {}
