/**
 * Escapes a string.
 * @private
 * @param {String} input the string to escape
 * @return {String} the escaped string.
 */
function escapeString(input) {
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
 * @private
 * @param {String} input the string to unescape
 * @return {String} the unescaped string.
 */
function unescapeString(input) {
  if (!input) {
    return "";
  }

  let nextBackslash;

  if ((nextBackslash = input.indexOf("\\")) === -1) {
    return input;
  }

  const end = input.length - 1;

  let output = "";
  let position = 0;

  do {
    if (position < nextBackslash) {
      output += input.slice(position, nextBackslash);
    }

    if ((position = nextBackslash + 1) >= end) {
      break;
    }

    let charCode = input.charCodeAt(position);

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

    output += String.fromCharCode(charCode);
    position += 1;
  } while ((nextBackslash = input.indexOf("\\", position)) !== -1);

  if (position <= end) {
    output += input.slice(position);
  }

  return output;
}

exports.escapeString = escapeString;
exports.unescapeString = unescapeString;
