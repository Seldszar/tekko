import { parse as parseMessage } from "../parse";

describe("parse", (): void => {
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
    test(`should parse "${testCase}"`, (): void => {
      try {
        const result = parseMessage(testCase);

        expect(result).toMatchSnapshot();
        expect(result.params).toMatchSnapshot();
      } catch (error) {
        expect(error).toMatchSnapshot();
      }
    });
  }
});
