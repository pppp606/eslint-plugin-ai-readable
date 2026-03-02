import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/rules/no-overloaded-flag-parameter.js";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: await import("@typescript-eslint/parser"),
  },
});

ruleTester.run("no-overloaded-flag-parameter", rule, {
  valid: [
    // No boolean arguments
    {
      code: "save(user, options);",
    },
    // Boolean in options object is OK
    {
      code: "save(user, { dryRun: true });",
    },
    // Non-boolean literals are OK
    {
      code: 'save(user, 1, "hello");',
    },
    // Variable reference (not a literal) is OK
    {
      code: "const flag = true; save(user, flag);",
    },
    // No arguments at all
    {
      code: "doSomething();",
    },
    // New expression without boolean
    {
      code: "new Foo(options);",
    },
    // maxAllowedBooleanArgs: 1 allows single boolean arg
    {
      code: "save(user, true);",
      options: [{ maxAllowedBooleanArgs: 1 }],
    },
    // maxAllowedBooleanArgs: 2 allows two boolean args
    {
      code: "fn(true, false);",
      options: [{ maxAllowedBooleanArgs: 2 }],
    },
    // ignorePattern matches function name
    {
      code: "assert.equal(value, true);",
      options: [{ ignorePattern: "^assert\\." }],
    },
    // ignorePattern matches simple function name
    {
      code: "expect(true);",
      options: [{ ignorePattern: "^expect$" }],
    },
    // Method call with boolean but matching ignorePattern
    {
      code: "console.log(true);",
      options: [{ ignorePattern: "^console\\." }],
    },
  ],
  invalid: [
    // Basic: boolean literal true as argument
    {
      code: "save(user, true);",
      errors: [{ messageId: "noOverloadedFlagParameter" }],
    },
    // Basic: boolean literal false as argument
    {
      code: "save(user, false);",
      errors: [{ messageId: "noOverloadedFlagParameter" }],
    },
    // Boolean as only argument
    {
      code: "toggle(true);",
      errors: [{ messageId: "noOverloadedFlagParameter" }],
    },
    // Multiple boolean arguments
    {
      code: "fn(true, false);",
      errors: [
        { messageId: "noOverloadedFlagParameter" },
        { messageId: "noOverloadedFlagParameter" },
      ],
    },
    // Boolean mixed with other args
    {
      code: 'fn(x, true, "hello");',
      errors: [{ messageId: "noOverloadedFlagParameter" }],
    },
    // NewExpression with boolean
    {
      code: "new Foo(true);",
      errors: [{ messageId: "noOverloadedFlagParameter" }],
    },
    // NewExpression with multiple booleans
    {
      code: "new Bar(true, false);",
      errors: [
        { messageId: "noOverloadedFlagParameter" },
        { messageId: "noOverloadedFlagParameter" },
      ],
    },
    // Method call with boolean
    {
      code: "obj.save(user, true);",
      errors: [{ messageId: "noOverloadedFlagParameter" }],
    },
    // Chained method call with boolean
    {
      code: "a.b.c(true);",
      errors: [{ messageId: "noOverloadedFlagParameter" }],
    },
    // maxAllowedBooleanArgs: 1, but 2 boolean args present
    {
      code: "fn(true, false);",
      options: [{ maxAllowedBooleanArgs: 1 }],
      errors: [
        { messageId: "noOverloadedFlagParameter" },
        { messageId: "noOverloadedFlagParameter" },
      ],
    },
    // ignorePattern does not match
    {
      code: "save(user, true);",
      options: [{ ignorePattern: "^expect$" }],
      errors: [{ messageId: "noOverloadedFlagParameter" }],
    },
  ],
});
