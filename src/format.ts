import { FormatError } from "./errors";
import { escapeString } from "./helpers";
import { MessagePrefix, MessageTags } from "./types";

/**
 * Formats message tags.
 * @param input the message tags
 * @return the formatted message tags.
 */
function formatTags(input: MessageTags): string {
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
 * @throws {FormatError}
 * @param input the message prefix
 * @return the formatted message prefix.
 */
function formatPrefix(input: MessagePrefix): string {
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
 * @param input the message
 * @return the formatted message.
 */
export function format(input: any): string {
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

  if (input.params && input.params.length > 0) {
    const trailing = input.params[input.params.length - 1];
    const middle = input.params.slice(0, -1);
    const middleLength = middle.length;

    for (let i = 0; i < middleLength; i += 1) {
      output += ` ${escapeString(middle[i])}`;
    }

    output += ` :${trailing}`;
  }

  return output;
}
