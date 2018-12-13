# Tekko

> Another IRC message parser and formatter.

Heavily inspired by [`irc-message`](https://github.com/sigkell/irc-message), this parser also includes a built-in tag value unescaper according to [IRCv3 Specifications](https://ircv3.net/specs/core/message-tags-3.2.html).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Author](#author)
- [License](#license)

## Installation

```bash
npm install tekko --save
```

## Usage

```javascript
const { format, parse } = require("tekko");

console.log(format({
  command: "PRIVMSG",
  params: ["#test"],
  prefix: {
    host: "madam",
    nick: "hello",
    user: "sir",
  },
  tags: {},
  trailing: "Hello, world!",
}));
/* ":hello!sir@madam PRIVMSG #test :Hello, world!"
 */

console.log(parse(":hello!sir@madam PRIVMSG #test :Hello, world!"));
/* { command: 'PRIVMSG',
 *   params: [ '#test' ],
 *   prefix:
 *    { host: 'madam',
 *      nick: 'hello',
 *      user: 'sir' },
 *   tags: {},
 *   trailing: 'Hello, world!' }
 */
```

# API

See the detailed [API Reference](API.md).

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)

## License

MIT © [Alexandre Breteau](https://seldszar.fr)
