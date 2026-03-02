import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/rules/no-single-letter-variables.js";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: await import("@typescript-eslint/parser"),
  },
});

ruleTester.run("no-single-letter-variables", rule, {
  valid: [
    // JS: multi-character variable names are allowed
    {
      code: "const count = 1;",
    },
    {
      code: "let result = getValue();",
    },
    // TS: typed multi-character variable names are allowed
    {
      code: "const count: number = 1;",
    },
    {
      code: "let result: string = 'hello';",
    },
  ],
  invalid: [
    // JS: single-letter variable names are disallowed
    {
      code: "const x = 1;",
      errors: [{ messageId: "noSingleLetterVariables" }],
    },
    {
      code: "let y = getValue();",
      errors: [{ messageId: "noSingleLetterVariables" }],
    },
    // TS: single-letter typed variable names are disallowed
    {
      code: "const x: number = 1;",
      errors: [{ messageId: "noSingleLetterVariables" }],
    },
    {
      code: "let y: string = 'hello';",
      errors: [{ messageId: "noSingleLetterVariables" }],
    },
  ],
});
