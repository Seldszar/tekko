import { ParseError } from "./errors";
import { unescapeString } from "./helpers";
import { Message, MessagePrefix } from "./types";

/**
 * Parses a message prefix.
 * @param input the message prefix input
 * @return the parsed message prefix.
 */
function parsePrefix(input: string): MessagePrefix | null {
  if (!input) {
    return null;
  }

  let userIndex: number;
  let hostIndex: number;

  if ((userIndex = input.indexOf("!")) === 0) {
    return null;
  }

  if ((hostIndex = input.indexOf("@", userIndex + 1)) === 0) {
    return null;
  }

  const prefix: Partial<MessagePrefix> = {};

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

  return prefix as MessagePrefix;
}

/**
 * Parses a message.
 * @throws {ParseError}
 * @param input the message input
 * @return the parsed message.
 */
export function parse(input: string): Message {
  const message: Partial<Message> = {
    params: [],
  };

  Object.defineProperties(message, {
    middle: {
      get(): string[] {
        return this.params.slice(0, -1);
      },
    },
    trailing: {
      get(): string {
        return this.params[this.params.length - 1];
      },
    },
  });

  let cursor = 0;
  let nextWhitespace = 0;

  if (input.charCodeAt(cursor) === 64) {
    if ((nextWhitespace = input.indexOf(" ")) === -1) {
      throw new ParseError("Invalid message");
    }

    message.tags = {};

    const tags = input.slice(1, nextWhitespace).split(";");
    const tagsLength = tags.length;

    for (let i = 0; i < tagsLength; i += 1) {
      const [key, value] = tags[i].split("=");
      message.tags[key] = value === undefined || unescapeString(value);
    }

    cursor = nextWhitespace + 1;
  }

  while (input.charCodeAt(cursor) === 32) {
    cursor += 1;
  }

  if (input.charCodeAt(cursor) === 58) {
    if ((nextWhitespace = input.indexOf(" ", cursor)) === -1) {
      throw new ParseError("Invalid message");
    }

    const prefix = parsePrefix(input.slice(cursor + 1, nextWhitespace));

    if (prefix) {
      message.prefix = prefix;
    }

    cursor = nextWhitespace + 1;

    while (input.charCodeAt(cursor) === 32) {
      cursor += 1;
    }
  }

  if ((nextWhitespace = input.indexOf(" ", cursor)) === -1) {
    if (input.length > cursor) {
      message.command = input.slice(cursor);
      return message as Message;
    }

    throw new ParseError("Invalid message");
  }

  message.command = input.slice(cursor, nextWhitespace);
  cursor = nextWhitespace + 1;

  while (input.charCodeAt(cursor) === 32) {
    cursor += 1;
  }

  while (cursor < input.length) {
    if (input.charCodeAt(cursor) === 58) {
      message.params.push(input.slice(cursor + 1));
      break;
    }

    if ((nextWhitespace = input.indexOf(" ", cursor)) === -1) {
      message.params.push(input.slice(cursor));
      break;
    }

    message.params.push(input.slice(cursor, nextWhitespace));
    cursor = nextWhitespace + 1;

    while (input.charCodeAt(cursor) === 32) {
      cursor += 1;
    }
  }

  return message as Message;
}
