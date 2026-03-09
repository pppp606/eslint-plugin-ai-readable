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
    // Words that start with a negative prefix but are not double negatives
    {
      code: "const isDisconnected = true;",
    },
    {
      code: "const isIncomplete = true;",
    },
    {
      code: "const isImpossible = true;",
    },
    {
      code: "const hasNonsense = true;",
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
    // --- ! + identifier: valid cases ---
    // Positive name — no negative word
    {
      code: "const x = !isEnabled;",
    },
    {
      code: "const x = !isReady;",
    },
    // "incomplete" is not in DEFAULT_NEGATIVE_WORDS
    {
      code: "const x = !isIncomplete;",
    },
    // allowList applies to negated identifiers
    {
      code: "const x = !isDisabled;",
      options: [{ allowList: ["isDisabled"] }],
    },
    // checkNegatedIdentifiers: false disables the check
    {
      code: "const x = !isDisabled;",
      options: [{ checkNegatedIdentifiers: false }],
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
    // VariableDeclarator (arrow function assigned to variable): not + disabled
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
    // Words removed from DEFAULT_NEGATIVE_WORDS are still caught via prefix-in-prefix detection
    // not + dis+connect
    {
      code: "const notDisconnect = true;",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // not + dis+approve
    {
      code: "const notDisapprove = true;",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // not + in+complete
    {
      code: "const notIncomplete = true;",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // not + im+possible
    {
      code: "const notImpossible = true;",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // not + non+sense
    {
      code: "const notNonsense = true;",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // not + non+compliant
    {
      code: "const notNoncompliant = true;",
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // negativeWords option: custom word "forbidden" detected
    {
      code: "const isNotForbidden = true;",
      options: [{ negativeWords: ["forbidden"] }],
      errors: [{ messageId: "noDoubleNegativeIdentifiers" }],
    },
    // --- ! + identifier: invalid cases ---
    // "disabled" is a negative word
    {
      code: "const x = !isDisabled;",
      errors: [{ messageId: "noNegatedNegativeIdentifier" }],
    },
    // "invalid" is a negative word
    {
      code: "const x = !isInvalid;",
      errors: [{ messageId: "noNegatedNegativeIdentifier" }],
    },
    // "unknown" is a negative word
    {
      code: "const x = !isUnknown;",
      errors: [{ messageId: "noNegatedNegativeIdentifier" }],
    },
    // "unavailable" is a negative word
    {
      code: "const x = !isUnavailable;",
      errors: [{ messageId: "noNegatedNegativeIdentifier" }],
    },
    // "inactive" is a negative word
    {
      code: "const x = !isInactive;",
      errors: [{ messageId: "noNegatedNegativeIdentifier" }],
    },
    // Custom negativeWords with ! operator
    {
      code: "const x = !isForbidden;",
      options: [{ negativeWords: ["forbidden"] }],
      errors: [{ messageId: "noNegatedNegativeIdentifier" }],
    },
    // MemberExpression: !obj.isDisabled
    {
      code: "const x = !obj.isDisabled;",
      errors: [{ messageId: "noNegatedNegativeIdentifier" }],
    },
    // Inside if condition
    {
      code: "if (!isDisabled) {}",
      errors: [{ messageId: "noNegatedNegativeIdentifier" }],
    },
    // Inside ternary
    {
      code: "const x = !isDisabled ? 'a' : 'b';",
      errors: [{ messageId: "noNegatedNegativeIdentifier" }],
    },
    // !! double bang: only inner ! is reported (outer ! negates a UnaryExpression, not an Identifier)
    {
      code: "const x = !!isDisabled;",
      errors: [{ messageId: "noNegatedNegativeIdentifier" }],
    },
  ],
});
