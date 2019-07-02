import { FormatError } from "../errors";
import { format as formatMessage } from "../format";
import { Message } from "../types";

describe("format", () => {
  const testCases = [
    {},
    { tags: "lorem", command: "FOO" },
    { tags: {}, command: "FOO" },
    { tags: { lorem: true }, command: "FOO" },
    { tags: { lorem: "" }, command: "FOO" },
    { tags: { lorem: "lorem" } },
    { tags: { lorem: "lorem", ipsum: "ipsum" }, command: "FOO" },
    { tags: { lorem: "lorem\\ipsum dolor\rsit\namet;" }, command: "FOO" },
    { tags: { lorem: true }, command: "FOO" },
    { tags: { lorem: true }, prefix: { user: "user" }, command: "FOO" },
    { prefix: "lorem", command: "FOO" },
    { prefix: { name: "se.rv.er" }, command: "FOO" },
    { prefix: { user: "user" }, command: "FOO" },
    { prefix: { name: "name", user: "user" }, command: "FOO" },
    { prefix: { name: "name", host: "host" }, command: "FOO" },
    { prefix: { name: "name", user: "user", host: "host" }, command: "FOO" },
    { command: "FOO" },
    { command: "FOO", params: [] },
    { command: "FOO", params: ["lorem"] },
    { command: "FOO", params: ["lorem", "ipsum"] },
    { command: "FOO", params: ["Lorem ipsum dolor sit amet"] },
    { params: ["lorem", "ipsum"] },
  ];

  for (const testCase of testCases) {
    test(`should format "${JSON.stringify(testCase)}"`, () => {
      let result: string | FormatError;

      try {
        result = formatMessage(testCase as Message);
      } catch (error) {
        result = error;
      }

      expect(result).toMatchSnapshot();
    });
  }
});
