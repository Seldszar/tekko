import { parse as parseMessage } from "../parse";

describe("parse", () => {
  const testCases = [
    "",
    "@",
    "FOO",
    ":test ",
    ":test FOO",
    ":test FOO     ",
    ":! FOO",
    ":@ FOO",
    ":nick FOO",
    ":nick!user FOO",
    ":nick!user@host FOO",
    ":nick@host FOO",
    ":se.rv.er FOO",
    ":test!me@test.ing PRIVMSG #Test :This is a test",
    "PRIVMSG #Test :This is a test",
    ":test PRIVMSG foo :A string   with spaces   ",
    ":test     PRIVMSG    foo     :bar",
    ":test FOO bar baz quux",
    "FOO bar baz quux",
    "FOO    bar      baz   quux",
    "FOO bar baz quux :This is a test",
    ":test PRIVMSG #fo:oo :This is a test",
    "@test=super;single :test!me@test.ing FOO bar baz quux :This is a test",
    "@test=super;single     :test!me@test.ing    FOO   bar    baz   quux   :This is a test",
    "@test=super;single :  This is a test",
    "@test=super;single :",
    "@test=;single :",
    "@test=super\\shyper;single :",
    "@test=super\\r\\n\\\\\\:\\shyper\\;single :",
  ];

  for (const testCase of testCases) {
    test(`should parse "${testCase}"`, () => {
      try {
        const result = parseMessage(testCase);

        expect(result).toMatchSnapshot();
        expect(result.params).toMatchSnapshot();
      } catch (error) {
        expect(error).toMatchSnapshot();
      }
    });
  }

  test(`should parse with custom tag mapper`, () => {
    const result = parseMessage("@test=super;single :test!me@test.ing FOO :This is a test", {
      tagMapper(key, value) {
        return [`${key}_mapped`, `${value}_mapped`];
      },
    });

    expect(result).toMatchSnapshot();
  });
});
