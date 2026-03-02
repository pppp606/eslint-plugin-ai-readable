import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/rules/no-double-negative-identifiers.js";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: await import("@typescript-eslint/parser"),
  },
});

ruleTester.run("no-double-negative-identifiers", rule, {
  valid: [
    // Positive identifiers are allowed
    {
      code: "const isEnabled = true;",
    },
    {
      code: "const hasPermission = true;",
    },
    {
      code: "const canRegister = true;",
    },
    // Single negation is allowed (prefix only, no negative word)
    {
      code: "const isNotReady = false;",
    },
    {
      code: "const isDisabled = false;",
    },
    {
      code: "const isUnknown = false;",
    },
    // checkProperties: false allows double-negative in properties
    {
      code: "const obj = { isNotDisabled: true };",
      options: [{ checkProperties: false }],
    },
    // allowList permits specific identifiers
    {
      code: "const isNotDisabled = true;",
      options: [{ allowList: ["isNotDisabled"] }],
    },
  ],
  invalid: [
    // VariableDeclarator: not + disabled
    {
      code: "const isNotDisabled = true;",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // VariableDeclarator: no + unavailable
    {
      code: "const hasNoUnavailable = false;",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // FunctionDeclaration: not + disabled
    {
      code: "function isNotDisabled() {}",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // FunctionExpression: not + invalid
    {
      code: "const fn = function isNotInvalid() {};",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // ArrowFunctionExpression variable name: not + disabled
    {
      code: "const isNotDisabled = () => {};",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // MethodDefinition: not + disabled
    {
      code: "class Foo { isNotDisabled() {} }",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // Property: not + disabled
    {
      code: "const obj = { isNotDisabled: true };",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // cannot + unregister pattern
    {
      code: "const cannotUnregister = true;",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // no + inactive pattern
    {
      code: "const hasNoInactive = true;",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // non + invalid pattern
    {
      code: "const isNonInvalid = true;",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // negativeWords option: custom word "forbidden" detected
    {
      code: "const isNotForbidden = true;",
      options: [{ negativeWords: ["forbidden"] }],
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
  ],
});
