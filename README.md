# Tekko

> Another IRC message parser and formatter.

Heavily inspired by [`irc-message`](https://github.com/sigkell/irc-message), this parser also includes a built-in tag value unescaper according to [IRCv3 Specifications](https://ircv3.net/specs/core/message-tags-3.2.html).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Author](#author)
- [License](#license)

## Installation

```bash
npm install tekko --save
```

## Usage

### Parse

```javascript
const { parse } = require("tekko");

const result = parse("@lorem=ipsum;dolor :hello!sir@madam PRIVMSG #test :Hello, world!"));
/* { command: 'PRIVMSG',
 *   params: [ '#test', 'Hello, world!' ],
 *   prefix:
 *    { host: 'madam',
 *      nick: 'hello',
 *      user: 'sir' },
 *   tags: {
 *      lorem: 'ipsum',
 *      dolor: true } }
 */

console.log(result.middle);
/* [ '#test' ]
 */

console.log(result.trailing);
/* 'Hello, world!'
 */
```

### Format

```javascript
const { format } = require("tekko");

const result = format({
  command: "PRIVMSG",
  params: ["#test", "Hello, world!"],
  prefix: {
    host: "madam",
    nick: "hello",
    user: "sir",
  },
  tags: {
    lorem: 'ipsum',
    dolor: true,
  },
});
/* "@lorem=ipsum;dolor :hello!sir@madam PRIVMSG #test :Hello, world!"
 */
```

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)

## License

MIT © [Alexandre Breteau](https://seldszar.fr)
