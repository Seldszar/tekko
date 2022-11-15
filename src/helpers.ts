/**
 * Indicates if a string should be escaped.
 * @param input the string to validate
 */
export function shouldEscapeString(input: string): boolean {
  for (let i = 0; i < input.length; i += 1) {
    const charCode = input.charCodeAt(i);

    switch (charCode) {
      case 10:
      case 13:
      case 32:
      case 59:
      case 92:
        return true;
    }
  }

  return false;
}

/**
 * Escapes a string.
 * @param input the string to escape
 * @return the escaped string.
 */
export function escapeString(input: string): string {
  if (!input) {
    return "";
  }

  let output = "";

  for (let i = 0; i < input.length; i += 1) {
    let charCode = input.charCodeAt(i);

    switch (charCode) {
      case 10:
        output += "\\n";
        break;

      case 13:
        output += "\\r";
        break;

      case 32:
        output += "\\s";
        break;

      case 59:
        output += "\\:";
        break;

      case 92:
        output += "\\\\";
        break;

      default:
        output += String.fromCharCode(charCode);
    }
  }

  return output;
}

/**
 * Unescapes a string.
 * @param input the string to unescape
 * @return the unescaped string.
 */
export function unescapeString(input: string): string {
  if (!input) {
    return "";
  }

  let nextBackslash: number;

  if ((nextBackslash = input.indexOf("\\")) === -1) {
    return input;
  }

  const end = input.length - 1;

  let cursor = 0;
  let output = "";

  do {
    if (cursor < nextBackslash) {
      output += input.slice(cursor, nextBackslash);
    }

    if ((cursor = nextBackslash + 1) >= end) {
      break;
    }

    let charCode = input.charCodeAt(cursor);

    switch (charCode) {
      case 58:
        charCode = 59;
        break;

      case 110:
        charCode = 10;
        break;

      case 114:
        charCode = 13;
        break;

      case 115:
        charCode = 32;
        break;
    }

    cursor += 1;
    output += String.fromCharCode(charCode);
  } while ((nextBackslash = input.indexOf("\\", cursor)) !== -1);

  if (cursor <= end) {
    output += input.slice(cursor);
  }

  return output;
}
