import { ParseError } from "./errors";
import { unescapeString } from "./helpers";
import { Message, MessagePrefix, MessageTags } from "./types";

/**
 * A tag mapping function.
 */
type TagMapper = (key: string, value: string | true) => [string, string | true];

/**
 * Parses message tags.
 * @param input the message tags input
 * @param mapper a mapping function
 * @return the parsed message tags.
 */
export function parseTags<T extends MessageTags = MessageTags>(
  input: string,
  mapper?: TagMapper
): T {
  const result = {};

  const tags = input.split(";");
  const tagsLength = tags.length;

  for (let i = 0; i < tagsLength; i += 1) {
    const pair = tags[i].split("=");

    let key = pair[0];
    let value = pair[1] === undefined || unescapeString(pair[1]);

    if (mapper) {
      [key, value] = mapper(key, value);
    }

    result[key] = value;
  }

  return result as T;
}

/**
 * Parses a message prefix.
 * @param input the message prefix input
 * @return the parsed message prefix.
 */
export function parsePrefix(input: string): MessagePrefix | null {
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

export interface ParseOptions {
  /**
   * A tag mapping function.
   */
  tagMapper?: TagMapper;
}

/**
 * Parses a message.
 * @throws {ParseError}
 * @param input the message input
 * @param options parse options
 * @return the parsed message.
 */
export function parse<T extends MessageTags = MessageTags>(
  input: string,
  options: ParseOptions = {}
): Message<T> {
  const message: Partial<Message<T>> = {};

  Object.defineProperties(message, {
    middle: {
      writable: true,
      value: [],
    },
    trailing: {
      writable: true,
      value: undefined,
    },
    params: {
      enumerable: true,
      get(): string[] {
        return this.middle.concat(this.trailing || []);
      },
    },
  });

  let cursor = 0;
  let nextWhitespace = 0;

  if (input.charCodeAt(cursor) === 64) {
    if ((nextWhitespace = input.indexOf(" ")) === -1) {
      throw new ParseError("Invalid Message");
    }

    message.tags = parseTags(input.slice(cursor + 1, nextWhitespace), options.tagMapper);
    cursor = nextWhitespace + 1;
  }

  while (input.charCodeAt(cursor) === 32) {
    cursor += 1;
  }

  if (input.charCodeAt(cursor) === 58) {
    if ((nextWhitespace = input.indexOf(" ", cursor)) === -1) {
      throw new ParseError("Invalid Message");
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

      return message as Message<T>;
    }

    throw new ParseError("Invalid Message");
  }

  message.command = input.slice(cursor, nextWhitespace);
  cursor = nextWhitespace + 1;

  while (input.charCodeAt(cursor) === 32) {
    cursor += 1;
  }

  while (cursor < input.length) {
    if (input.charCodeAt(cursor) === 58) {
      message.trailing = input.slice(cursor + 1);
      break;
    }

    if ((nextWhitespace = input.indexOf(" ", cursor)) === -1) {
      message.middle.push(input.slice(cursor));
      break;
    }

    message.middle.push(input.slice(cursor, nextWhitespace));
    cursor = nextWhitespace + 1;

    while (input.charCodeAt(cursor) === 32) {
      cursor += 1;
    }
  }

  return message as Message<T>;
}
