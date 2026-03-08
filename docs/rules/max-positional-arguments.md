# max-positional-arguments

Enforce a maximum number of positional arguments in function calls.

As positional arguments increase, it becomes harder for both humans and AI to understand what each argument represents at the call site. This rule encourages the use of options objects for better readability.

## Rule Details

This rule reports function calls and `new` expressions that exceed a maximum number of positional arguments. Spread elements are not counted.

### Examples of **incorrect** code

```js
createUser("john", "admin", "active");
createTask(title, description, userId);
fn(a, b, c, d);
new Foo(a, b, c);
obj.save(a, b, c);
```

### Examples of **correct** code

```js
createUser({ name: "john", role: "admin", status: "active" });
createTask({ title, description, userId });
fn(a, b);
new Foo(a, b);
obj.save(a, { dryRun: true });
fn(a, b, ...rest); // Spread elements are not counted
```

## Options

This rule accepts an options object with the following properties:

### `max`

Type: `number`
Default: `2`

Maximum number of positional arguments allowed per call. Arguments exceeding this count trigger the rule.

```json
{
  "ai-readable/max-positional-arguments": [
    "warn",
    {
      "max": 3
    }
  ]
}
```

### `ignoreFunctions`

Type: `string[]`
Default: `[]`

A list of function names to ignore. Supports dotted names for member expressions (e.g., `Math.max`, `console.log`).

```json
{
  "ai-readable/max-positional-arguments": [
    "warn",
    {
      "ignoreFunctions": ["Math.max", "Math.min", "setTimeout", "setInterval", "console.log"]
    }
  ]
}
```

## Detection Scope

This rule checks the following expression types:

- **Function calls** (`fn(a, b, c)`, `obj.method(a, b, c)`, `a.b.c(x, y, z)`)
- **New expressions** (`new Foo(a, b, c)`)

The following are **not** counted by this rule:

- Spread elements (`fn(a, b, ...rest)` — only `a` and `b` are counted)

## When Not To Use It

If your codebase frequently uses functions with many positional arguments by convention (e.g., mathematical functions, variadic utilities), or if you prefer not to enforce options object patterns.
