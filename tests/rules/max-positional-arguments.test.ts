import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/rules/max-positional-arguments.js";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: await import("@typescript-eslint/parser"),
  },
});

ruleTester.run("max-positional-arguments", rule, {
  valid: [
    // No arguments
    {
      code: "doSomething();",
    },
    // Single argument
    {
      code: "save(user);",
    },
    // Two arguments (default max=2)
    {
      code: "save(user, options);",
    },
    // Options object pattern is OK
    {
      code: 'createUser({ name: "john", role: "admin", status: "active" });',
    },
    // Spread argument should not count
    {
      code: "fn(a, b, ...rest);",
    },
    // New expression with <= max args
    {
      code: "new Foo(a, b);",
    },
    // Custom max option allows more args
    {
      code: "fn(a, b, c);",
      options: [{ max: 3 }],
    },
    // Custom max=4
    {
      code: "fn(a, b, c, d);",
      options: [{ max: 4 }],
    },
    // ignoreFunctions: Math.max
    {
      code: "Math.max(a, b, c, d);",
      options: [{ ignoreFunctions: ["Math.max"] }],
    },
    // ignoreFunctions: console.log
    {
      code: "console.log(a, b, c, d, e);",
      options: [{ ignoreFunctions: ["console.log"] }],
    },
    // ignoreFunctions: setTimeout
    {
      code: "setTimeout(fn, 1000, arg1);",
      options: [{ ignoreFunctions: ["setTimeout"] }],
    },
    // ignoreFunctions: multiple patterns
    {
      code: "Math.min(a, b, c);",
      options: [{ ignoreFunctions: ["Math.max", "Math.min"] }],
    },
    // ignoreFunctions: NewExpression
    {
      code: "new Foo(a, b, c);",
      options: [{ ignoreFunctions: ["Foo"] }],
    },
    // Method call within max
    {
      code: "obj.save(a, b);",
    },
    // Single positional + options object
    {
      code: "createUser(name, { role: admin });",
    },
  ],
  invalid: [
    // Basic: 3 positional args with default max=2
    {
      code: 'createUser("john", "admin", "active");',
      errors: [{ messageId: "maxPositionalArguments" }],
    },
    // 3 variable arguments
    {
      code: "createTask(title, description, userId);",
      errors: [{ messageId: "maxPositionalArguments" }],
    },
    // 4 arguments
    {
      code: "fn(a, b, c, d);",
      errors: [{ messageId: "maxPositionalArguments" }],
    },
    // New expression with too many args
    {
      code: "new Foo(a, b, c);",
      errors: [{ messageId: "maxPositionalArguments" }],
    },
    // Method call with too many args
    {
      code: "obj.save(a, b, c);",
      errors: [{ messageId: "maxPositionalArguments" }],
    },
    // Chained method call with too many args
    {
      code: "a.b.c(x, y, z);",
      errors: [{ messageId: "maxPositionalArguments" }],
    },
    // Custom max=1 with 2 args
    {
      code: "fn(a, b);",
      options: [{ max: 1 }],
      errors: [{ messageId: "maxPositionalArguments" }],
    },
    // Custom max=0 with 1 arg
    {
      code: "fn(a);",
      options: [{ max: 0 }],
      errors: [{ messageId: "maxPositionalArguments" }],
    },
    // ignoreFunctions does not match
    {
      code: "createUser(a, b, c);",
      options: [{ ignoreFunctions: ["Math.max"] }],
      errors: [{ messageId: "maxPositionalArguments" }],
    },
    // Spread args don't count, but non-spread still exceed max
    {
      code: "fn(a, b, c, ...rest);",
      errors: [{ messageId: "maxPositionalArguments" }],
    },
  ],
});
