# no-implicit-boolean-conversion-in-conditions

Disallow implicit boolean conversions in conditional expressions.

Relying on JavaScript's truthy/falsy coercion (e.g., `if (value)`) hides the author's intent. Requiring explicit comparisons (e.g., `if (value !== "")`, `if (items.length > 0)`) makes the expected type and boundary condition clear to both human readers and AI tools.

## Rule Details

This rule detects condition expressions that rely on implicit boolean conversion instead of explicit comparisons.

### Examples of **incorrect** code

```js
if (value) {}
if (items.length) {}
if (!value) {}
if (!!value) {}
if (getValue()) {}
if (obj.prop) {}
if (a && b) {}
while (condition) {}
do {} while (flag);
for (; value; ) {}
const x = value ? "yes" : "no";
```

### Examples of **correct** code

```js
if (value !== "") {}
if (items.length > 0) {}
if (value !== null) {}
if (value !== undefined) {}
if (value === true) {}
if (a > 0 && b !== "") {}
if (typeof x === "string") {}
if (x instanceof Array) {}
if ("prop" in obj) {}
if (!(a > 0)) {}
while (i < 10) {}
do {} while (i !== 0);
for (let i = 0; i < 10; i++) {}
const x = a > 0 ? "yes" : "no";
```

## Options

This rule accepts an options object with the following properties:

### `allowBooleanIdentifiers`

Type: `boolean`
Default: `false`

When `true`, identifiers with boolean-semantic prefixes (`is`, `has`, `should`, `can`, `will`, `was`, `did`) are allowed without explicit comparison.

```json
{
  "ai-readable/no-implicit-boolean-conversion-in-conditions": ["warn", {
    "allowBooleanIdentifiers": true
  }]
}
```

With this option, the following code is valid:

```js
if (isReady) {}
if (hasPermission) {}
if (!isReady) {}
```

### `allowNullishCheck`

Type: `boolean`
Default: `false`

When `true`, loose equality checks against `null` (`== null`, `!= null`) are explicitly allowed. These are already valid by default since they use comparison operators, but this option documents the intent to permit the `== null` idiom for nullish checks.

```json
{
  "ai-readable/no-implicit-boolean-conversion-in-conditions": ["warn", {
    "allowNullishCheck": true
  }]
}
```

## Detection Scope

This rule checks the test expression in the following statement types:

- **`if` statements** (`if (condition) {}`)
- **`while` statements** (`while (condition) {}`)
- **`do-while` statements** (`do {} while (condition);`)
- **`for` statements** (`for (; condition; ) {}`)
- **Conditional (ternary) expressions** (`condition ? a : b`)

## When Not To Use It

If your team prefers the conciseness of truthy/falsy checks and is comfortable with JavaScript's type coercion rules, or if you are working with a codebase where implicit conversions are idiomatic.
