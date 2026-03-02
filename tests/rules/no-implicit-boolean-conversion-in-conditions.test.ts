import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/rules/no-implicit-boolean-conversion-in-conditions.js";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: await import("@typescript-eslint/parser"),
  },
});

ruleTester.run("no-implicit-boolean-conversion-in-conditions", rule, {
  valid: [
    // Explicit string comparison
    {
      code: 'if (value !== "") {}',
    },
    // Explicit number comparison on length
    {
      code: "if (items.length > 0) {}",
    },
    // Explicit null check
    {
      code: "if (value !== null) {}",
    },
    // Explicit undefined check
    {
      code: "if (value !== undefined) {}",
    },
    // Explicit boolean check
    {
      code: "if (value === true) {}",
    },
    // Comparison operator
    {
      code: "if (a > b) {}",
    },
    // Strict equality
    {
      code: "if (a === b) {}",
    },
    // typeof check
    {
      code: 'if (typeof x === "string") {}',
    },
    // instanceof check
    {
      code: "if (x instanceof Array) {}",
    },
    // in operator
    {
      code: 'if ("prop" in obj) {}',
    },
    // Logical AND with all explicit operands
    {
      code: 'if (a > 0 && b !== "") {}',
    },
    // Logical OR with all explicit operands
    {
      code: "if (a > 0 || b < 10) {}",
    },
    // Negation of explicit comparison
    {
      code: "if (!(a > 0)) {}",
    },
    // Boolean literal true
    {
      code: "if (true) {}",
    },
    // Boolean literal false
    {
      code: "if (false) {}",
    },
    // For loop with explicit comparison
    {
      code: "for (let i = 0; i < 10; i++) {}",
    },
    // Ternary with explicit condition
    {
      code: 'const x = a > 0 ? "yes" : "no";',
    },
    // While with explicit comparison
    {
      code: "while (i < 10) {}",
    },
    // Do-while with explicit comparison
    {
      code: "do {} while (i !== 0);",
    },
    // allowBooleanIdentifiers: is-prefix
    {
      code: "if (isReady) {}",
      options: [{ allowBooleanIdentifiers: true }],
    },
    // allowBooleanIdentifiers: has-prefix
    {
      code: "if (hasPermission) {}",
      options: [{ allowBooleanIdentifiers: true }],
    },
    // allowBooleanIdentifiers: should-prefix
    {
      code: "if (shouldUpdate) {}",
      options: [{ allowBooleanIdentifiers: true }],
    },
    // allowBooleanIdentifiers: can-prefix
    {
      code: "if (canEdit) {}",
      options: [{ allowBooleanIdentifiers: true }],
    },
    // allowBooleanIdentifiers: will-prefix
    {
      code: "if (willChange) {}",
      options: [{ allowBooleanIdentifiers: true }],
    },
    // allowBooleanIdentifiers: was-prefix
    {
      code: "if (wasDeleted) {}",
      options: [{ allowBooleanIdentifiers: true }],
    },
    // allowBooleanIdentifiers: did-prefix
    {
      code: "if (didComplete) {}",
      options: [{ allowBooleanIdentifiers: true }],
    },
    // allowBooleanIdentifiers: negated boolean identifier
    {
      code: "if (!isReady) {}",
      options: [{ allowBooleanIdentifiers: true }],
    },
    // allowNullishCheck: loose null check with !=
    {
      code: "if (value != null) {}",
      options: [{ allowNullishCheck: true }],
    },
    // allowNullishCheck: loose null check with ==
    {
      code: "if (value == null) {}",
      options: [{ allowNullishCheck: true }],
    },
  ],
  invalid: [
    // Simple identifier in if condition
    {
      code: "if (value) {}",
      errors: [{ messageId: "noImplicitBooleanConversion" }],
    },
    // Member expression (length) in if condition
    {
      code: "if (items.length) {}",
      errors: [{ messageId: "noImplicitBooleanConversion" }],
    },
    // While with identifier
    {
      code: "while (condition) {}",
      errors: [{ messageId: "noImplicitBooleanConversion" }],
    },
    // Do-while with identifier
    {
      code: "do {} while (flag);",
      errors: [{ messageId: "noImplicitBooleanConversion" }],
    },
    // For with identifier as test
    {
      code: "for (; value; ) {}",
      errors: [{ messageId: "noImplicitBooleanConversion" }],
    },
    // Ternary with identifier
    {
      code: 'const x = value ? "yes" : "no";',
      errors: [{ messageId: "noImplicitBooleanConversion" }],
    },
    // Negated identifier (still implicit)
    {
      code: "if (!value) {}",
      errors: [{ messageId: "noImplicitBooleanConversion" }],
    },
    // Function call without comparison
    {
      code: "if (getValue()) {}",
      errors: [{ messageId: "noImplicitBooleanConversion" }],
    },
    // Member expression (property access)
    {
      code: "if (obj.prop) {}",
      errors: [{ messageId: "noImplicitBooleanConversion" }],
    },
    // Logical AND with implicit operands (2 errors)
    {
      code: "if (a && b) {}",
      errors: [
        { messageId: "noImplicitBooleanConversion" },
        { messageId: "noImplicitBooleanConversion" },
      ],
    },
    // Logical OR with implicit operands (2 errors)
    {
      code: "if (a || b) {}",
      errors: [
        { messageId: "noImplicitBooleanConversion" },
        { messageId: "noImplicitBooleanConversion" },
      ],
    },
    // Double negation (still implicit)
    {
      code: "if (!!value) {}",
      errors: [{ messageId: "noImplicitBooleanConversion" }],
    },
    // allowBooleanIdentifiers: true, but non-prefixed identifier is still invalid
    {
      code: "if (value) {}",
      options: [{ allowBooleanIdentifiers: true }],
      errors: [{ messageId: "noImplicitBooleanConversion" }],
    },
    // allowBooleanIdentifiers: true, but member expression (length) is still invalid
    {
      code: "if (items.length) {}",
      options: [{ allowBooleanIdentifiers: true }],
      errors: [{ messageId: "noImplicitBooleanConversion" }],
    },
    // allowNullishCheck: true, but simple identifier is still invalid
    {
      code: "if (value) {}",
      options: [{ allowNullishCheck: true }],
      errors: [{ messageId: "noImplicitBooleanConversion" }],
    },
  ],
});
