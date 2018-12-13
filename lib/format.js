const { FormatError } = require("./errors");
const { escapeString } = require("./helpers");

/**
 * Formats message tags.
 * @private
 * @param {Object} input the message tags
 * @return {String} the formatted message tags.
 */
function formatTags(input) {
  const tagPairs = Object.entries(input);
  const tagPairsLength = tagPairs.length;

  let output = "";

  for (let i = 0; i < tagPairsLength; i += 1) {
    const [key, value] = tagPairs[i];

    output += key;

    if (value !== true) {
      output += `=${escapeString(value)}`;
    }

    if (i < tagPairsLength - 1) {
      output += ";";
    }
  }

  return output;
}

/**
 * Formats a message prefix.
 * @private
 * @throws {FormatError}
 * @param {MessagePrefix} input the message prefix
 * @return {String} the formatted message prefix.
 */
function formatPrefix(input) {
  if (input.name) {
    let output = input.name;

    if (input.host) {
      if (input.user) {
        output += `!${input.user}`;
      }

      output += `@${input.host}`;
    }

    return output;
  }

  throw new FormatError("Invalid prefix");
}

/**
 * Formats a message.
 * @throws {FormatError}
 * @param {Message} input the message
 * @return {?String} the formatted message.
 */
function format(input) {
  if (!input || !input.command) {
    throw new FormatError("Invalid message");
  }

  let output = "";

  if (input.tags && Object.keys(input.tags).length > 0) {
    output += `@${formatTags(input.tags)}`;
  }

  if (input.prefix && Object.keys(input.prefix).length > 0) {
    if (output) {
      output += " ";
    }

    output += `:${formatPrefix(input.prefix)}`;
  }

  if (output) {
    output += " ";
  }

  output += input.command;

  if (input.params) {
    const paramsLength = input.params.length;

    for (let i = 0; i < paramsLength; i += 1) {
      output += ` ${escapeString(input.params[i])}`;
    }
  }

  if (input.trailing) {
    output += ` :${input.trailing}`;
  }

  return output;
}

module.exports = format;
