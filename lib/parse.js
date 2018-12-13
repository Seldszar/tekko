const { ParseError } = require("./errors");
const { unescapeString } = require("./helpers");

/**
 * Parses a message prefix.
 * @private
 * @param {String} input the message prefix input
 * @return {?MessagePrefix} the parsed message prefix.
 */
function parsePrefix(input) {
  if (!input) {
    return null;
  }

  let userIndex;
  let hostIndex;

  if ((userIndex = input.indexOf("!")) === 0) {
    return null;
  }

  if ((hostIndex = input.indexOf("@", userIndex + 1)) === 0) {
    return null;
  }

  const prefix = {
    name: null,
    user: null,
    host: null,
  };

  if (userIndex > -1 && hostIndex > -1) {
    prefix.name = input.slice(0, userIndex);
    prefix.user = input.slice(userIndex + 1, hostIndex);
    prefix.host = input.slice(hostIndex + 1);
  } else if (userIndex > -1) {
    prefix.name = input.slice(0, userIndex);
    prefix.user = input.slice(userIndex + 1);
  } else if (hostIndex > -1) {
    prefix.name = input.slice(0, hostIndex);
    prefix.host = input.slice(hostIndex + 1);
  } else {
    prefix.name = input;
  }

  return prefix;
}

/**
 * Parses a message.
 * @throws {ParseError}
 * @param {String} input the message input
 * @return {?Message} the parsed message.
 */
function parse(input) {
  if (!input) {
    throw new ParseError("Invalid message");
  }

  const message = {
    tags: {},
    prefix: null,
    command: null,
    params: [],
    trailing: null,
  };

  let position = 0;
  let nextWhitespace = 0;

  if (input.charCodeAt(0) === 64) {
    if ((nextWhitespace = input.indexOf(" ")) === -1) {
      throw new ParseError("Invalid message");
    }

    const tags = input.slice(1, nextWhitespace).split(";");
    const tagsLength = tags.length;

    for (let i = 0; i < tagsLength; i += 1) {
      const [key, value] = tags[i].split("=");
      message.tags[key] = value === undefined || unescapeString(value);
    }

    position = nextWhitespace + 1;
  }

  while (input.charCodeAt(position) === 32) {
    position += 1;
  }

  if (input.charCodeAt(position) === 58) {
    if ((nextWhitespace = input.indexOf(" ", position)) === -1) {
      throw new ParseError("Invalid message");
    }

    message.prefix = parsePrefix(input.slice(position + 1, nextWhitespace));
    position = nextWhitespace + 1;

    while (input.charCodeAt(position) === 32) {
      position += 1;
    }
  }

  if ((nextWhitespace = input.indexOf(" ", position)) === -1) {
    if (input.length > position) {
      message.command = input.slice(position);
      return message;
    }

    throw new ParseError("Invalid message");
  }

  message.command = input.slice(position, nextWhitespace);
  position = nextWhitespace + 1;

  while (input.charCodeAt(position) === 32) {
    position += 1;
  }

  while (position < input.length) {
    if (input.charCodeAt(position) === 58) {
      message.trailing = input.slice(position + 1);
      break;
    }

    if ((nextWhitespace = input.indexOf(" ", position)) === -1) {
      message.params.push(input.slice(position));
      break;
    }

    message.params.push(input.slice(position, nextWhitespace));
    position = nextWhitespace + 1;

    while (input.charCodeAt(position) === 32) {
      position += 1;
    }
  }

  return message;
}

module.exports = parse;
