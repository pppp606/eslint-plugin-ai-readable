import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/rules/require-named-intermediate-for-complex-condition.js";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: await import("@typescript-eslint/parser"),
  },
});

ruleTester.run("require-named-intermediate-for-complex-condition", rule, {
  valid: [
    // Simple condition with no logical operators
    {
      code: "if (a) {}",
    },
    // Single operator within limit (1 operator, default max is 2)
    {
      code: "if (a && b) {}",
    },
    // Two operators at the limit (2 operators: &&, ||, default max is 2)
    {
      code: "if (a && b || c) {}",
    },
    // Named intermediate for complex condition
    {
      code: "const canProceed = (a && b) || (!c && d) || e; if (canProceed) {}",
    },
    // While loop with simple condition (1 operator)
    {
      code: "while (a && b) {}",
    },
    // Ternary with simple condition (1 operator)
    {
      code: "const x = a && b ? 1 : 0;",
    },
    // For loop with simple condition (1 operator)
    {
      code: "for (; a && b;) {}",
    },
    // Custom maxOperators allowing more operators (3 operators, maxOperators: 4)
    {
      code: "if (a && b && c && d) {}",
      options: [{ maxOperators: 4 }],
    },
    // Custom maxDepth allowing deeper nesting (depth 3, maxDepth: 4)
    {
      code: "if (a && (b || (c && d))) {}",
      options: [{ maxOperators: 4, maxDepth: 4 }],
    },
    // Named intermediate used in while loop
    {
      code: "const isValid = a && b || c && d; while (isValid) {}",
    },
    // Condition with ! operator within limit (2 operators: ! and &&)
    {
      code: "if (!a && b) {}",
    },
    // Do-while with simple condition (1 operator)
    {
      code: "do {} while (a || b);",
    },
    // Named intermediate used in ternary
    {
      code: "const isReady = a && b || c && d; const x = isReady ? 1 : 0;",
    },
    // Named intermediate used in for loop
    {
      code: "const shouldContinue = a && b || c && d; for (; shouldContinue;) {}",
    },
    // Negated condition within limit: !(a && b) has depth 1, operators 2 (!, &&)
    {
      code: "if (!(a && b)) {}",
    },
    // Nullish coalescing within limit (2 operators: ??, ||)
    {
      code: "if (a ?? b || c) {}",
    },
    // For loop with no test expression
    {
      code: "for (;;) {}",
    },
  ],
  invalid: [
    // Too many operators: 3 operators (&&, ||, &&), default max is 2
    {
      code: "if (a && b || c && d) {}",
      errors: [
        {
          messageId: "tooManyOperators",
          data: { count: "3", max: "2" },
        },
      ],
    },
    // Many operators with !: 5 operators (&&, ||, !, &&, ||), default max is 2
    {
      code: "if ((a && b) || (!c && d) || e) {}",
      errors: [
        {
          messageId: "tooManyOperators",
          data: { count: "5", max: "2" },
        },
      ],
    },
    // While loop with complex condition: 3 operators (&&, ||, &&)
    {
      code: "while (a && b || c && d) {}",
      errors: [
        {
          messageId: "tooManyOperators",
          data: { count: "3", max: "2" },
        },
      ],
    },
    // Do-while with complex condition: 3 operators (&&, ||, &&)
    {
      code: "do {} while (a && b || c && d);",
      errors: [
        {
          messageId: "tooManyOperators",
          data: { count: "3", max: "2" },
        },
      ],
    },
    // For loop with complex condition: 3 operators (&&, ||, &&)
    {
      code: "for (; a && b || c && d;) {}",
      errors: [
        {
          messageId: "tooManyOperators",
          data: { count: "3", max: "2" },
        },
      ],
    },
    // Ternary with complex condition: 3 operators (&&, ||, &&)
    {
      code: "const x = a && b || c && d ? 1 : 0;",
      errors: [
        {
          messageId: "tooManyOperators",
          data: { count: "3", max: "2" },
        },
      ],
    },
    // Too deep nesting: depth 3 (a && (b || (c && d))), default max is 2; also 3 operators exceeding max 2
    {
      code: "if (a && (b || (c && d))) {}",
      errors: [
        {
          messageId: "tooManyOperators",
          data: { count: "3", max: "2" },
        },
        {
          messageId: "tooDeep",
          data: { depth: "3", max: "2" },
        },
      ],
    },
    // Negated nested condition: !(a && (b || c)) has depth 2, operators 3 (!, &&, ||) exceeding max 2
    {
      code: "if (!(a && (b || c))) {}",
      errors: [
        {
          messageId: "tooManyOperators",
          data: { count: "3", max: "2" },
        },
      ],
    },
    // Deeply negated condition: !(a && (b || (c && d))) has depth 3 exceeding max 2, operators 4
    {
      code: "if (!(a && (b || (c && d)))) {}",
      errors: [
        {
          messageId: "tooManyOperators",
          data: { count: "4", max: "2" },
        },
        {
          messageId: "tooDeep",
          data: { depth: "3", max: "2" },
        },
      ],
    },
    // Custom maxOperators (stricter): 1 operator (&&), maxOperators: 0
    {
      code: "if (a && b) {}",
      options: [{ maxOperators: 0 }],
      errors: [
        {
          messageId: "tooManyOperators",
          data: { count: "1", max: "0" },
        },
      ],
    },
    // Both maxOperators and maxDepth exceeded: 3 operators, depth 3
    {
      code: "if (a && (b || (c && d))) {}",
      options: [{ maxOperators: 2, maxDepth: 1 }],
      errors: [
        {
          messageId: "tooManyOperators",
          data: { count: "3", max: "2" },
        },
        {
          messageId: "tooDeep",
          data: { depth: "3", max: "1" },
        },
      ],
    },
    // Nullish coalescing mixed with && exceeding limit: 3 operators (??, &&, ??)
    {
      code: "if ((a ?? b) && (c ?? d)) {}",
      errors: [
        {
          messageId: "tooManyOperators",
          data: { count: "3", max: "2" },
        },
      ],
    },
  ],
});
