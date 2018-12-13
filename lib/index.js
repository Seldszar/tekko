const { FormatError, ParseError } = require("./errors");

/**
 * A message prefix.
 * @typedef {Object} MessagePrefix
 * @property {?String} name the name
 * @property {?String} user the user
 * @property {?String} host the host
 */

/**
 * A message.
 * @typedef {Object} Message
 * @property {Object} tags the tags
 * @property {?MessagePrefix} prefix the prefix
 * @property {String} command the command
 * @property {Array<String>} params the parameters
 * @property {String} trailing the trailing
 */

module.exports = {
  FormatError,
  ParseError,
  format: require("./format"),
  parse: require("./parse"),
};
