import { FormatError } from "./errors";
import { escapeString, shouldEscapeString } from "./helpers";
import { MessageInputLegacy, MessageInputComposite, MessagePrefix, MessageTags } from "./types";

/**
 * Formats message tags.
 * @param input the message tags
 * @return the formatted message tags.
 */
export function formatTags(input: string | MessageTags): string {
  if (typeof input === "string") {
    return input;
  }

  const tagPairs = Object.entries(input);
  const tagPairsLength = tagPairs.length;

  let output = "";

  for (let i = 0; i < tagPairsLength; i += 1) {
    const [key, value] = tagPairs[i];

    output += key;

    if (typeof value === "string") {
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
export function formatPrefix(input: string | MessagePrefix): string {
  if (typeof input === "string") {
    return input;
  }

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

  throw new FormatError("Invalid Prefix");
}

/**
 * Formats a message.
 * @throws {FormatError}
 * @param input the message
 * @return the formatted message.
 */
export function format(input: string | MessageInputLegacy | MessageInputComposite): string {
  if (typeof input === "string") {
    return input;
  }

  if (!input || !input.command) {
    throw new FormatError("Invalid Message");
  }

  let middle: string[];
  let trailing: string;
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

  if ("params" in input) {
    const last = input.params[input.params.length - 1];

    if (last && shouldEscapeString(last)) {
      middle = input.params.slice(0, -1);
      trailing = last;
    } else {
      middle = input.params;
    }
  }

  if ("middle" in input) {
    middle = input.middle;
  }

  if ("trailing" in input) {
    trailing = input.trailing;
  }

  if (middle) {
    for (let i = 0; i < middle.length; i += 1) {
      output += ` ${escapeString(middle[i])}`;
    }
  }

  if (trailing) {
    output += ` :${trailing}`;
  }

  return output;
}
