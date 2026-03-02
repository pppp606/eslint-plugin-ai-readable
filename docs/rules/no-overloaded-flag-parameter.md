# no-overloaded-flag-parameter

Disallow boolean literal arguments that reduce readability.

Passing bare `true` or `false` as function arguments (e.g., `save(user, true)`) makes code hard to understand because the meaning of the boolean is not clear at the call site. Use an options object instead (e.g., `save(user, { dryRun: true })`).

## Rule Details

This rule detects boolean literals (`true` / `false`) passed as arguments to function calls and `new` expressions.

### Examples of **incorrect** code

```js
save(user, true);
save(user, false);
toggle(true);
fn(true, false);
new Foo(true);
obj.save(user, true);
```

### Examples of **correct** code

```js
save(user, { dryRun: true });
save(user, options);
toggle({ force: true });
new Foo({ verbose: true });

const flag = true;
save(user, flag); // Variable reference is OK
```

## Options

This rule accepts an options object with the following properties:

### `maxAllowedBooleanArgs`

Type: `number`
Default: `0`

Maximum number of boolean literal arguments allowed before reporting. Setting to `1` allows a single boolean argument per call.

```json
{
  "ai-readable/no-overloaded-flag-parameter": ["warn", {
    "maxAllowedBooleanArgs": 1
  }]
}
```

### `ignorePattern`

Type: `string`
Default: none

A regular expression pattern to match function names that should be ignored. Useful for test utilities like `assert`, `expect`, etc.

```json
{
  "ai-readable/no-overloaded-flag-parameter": ["warn", {
    "ignorePattern": "^(assert|expect)"
  }]
}
```

## Detection Scope

This rule checks the following expression types:

- **Function calls** (`fn(true)`, `obj.method(true)`, `a.b.c(true)`)
- **New expressions** (`new Foo(true)`)

The following are **not** reported by this rule:

- Boolean values inside options objects (`fn({ flag: true })`)
- Boolean variables passed as arguments (`fn(myFlag)`)
- Non-boolean literals (`fn(1, "hello")`)

## When Not To Use It

If your codebase frequently uses boolean arguments by convention and you prefer conciseness over explicitness, or if you are working with APIs that require boolean parameters.
