# no-implicit-boolean-conversion-in-conditions

Disallow implicit boolean conversions in conditional expressions.

Relying on JavaScript's truthy/falsy coercion (e.g., `if (value)`) hides the author's intent. Requiring explicit comparisons (e.g., `if (value !== "")`, `if (items.length > 0)`) makes the expected type and boundary condition clear to both human readers and AI tools.

## Rule Details

This rule detects condition expressions that rely on implicit boolean conversion instead of explicit comparisons.

### Examples of **incorrect** code

```js
if (value) {
}
if (items.length) {
}
if (!value) {
}
if (!!value) {
}
if (getValue()) {
}
if (obj.prop) {
}
if (a && b) {
}
if (!(a && b)) {
} // reports each implicit operand individually
if (value == null) {
} // loose equality is implicit by default
if (value != null) {
} // loose equality is implicit by default
if (a == b) {
} // loose equality without null is not explicit
while (condition) {}
do {} while (flag);
for (; value; ) {}
const x = value ? "yes" : "no";
```

### Examples of **correct** code

```js
if (value !== "") {
}
if (items.length > 0) {
}
if (value !== null) {
}
if (value !== undefined) {
}
if (value === true) {
}
if (a > 0 && b !== "") {
}
if (typeof x === "string") {
}
if (x instanceof Array) {
}
if ("prop" in obj) {
}
if (!(a > 0)) {
}
if (!(a > 0 && b !== "")) {
} // negated logical with explicit operands
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

When `true`, identifiers and member expression properties with boolean-semantic prefixes (`is`, `has`, `should`, `can`, `will`, `was`, `did`) are allowed without explicit comparison.

```json
{
  "ai-readable/no-implicit-boolean-conversion-in-conditions": [
    "warn",
    {
      "allowBooleanIdentifiers": true
    }
  ]
}
```

With this option, the following code is valid:

```js
if (isReady) {
}
if (hasPermission) {
}
if (!isReady) {
}
if (this.isReady) {
}
if (obj.hasPermission) {
}
```

### `allowNullishCheck`

Type: `boolean`
Default: `false`

When `true`, loose equality checks against `null` (`== null`, `!= null`) are allowed. By default, loose equality operators (`==`, `!=`) are treated as implicit boolean conversions and will be flagged. Enabling this option permits the common `== null` / `!= null` idiom for nullish checks.

```json
{
  "ai-readable/no-implicit-boolean-conversion-in-conditions": [
    "warn",
    {
      "allowNullishCheck": true
    }
  ]
}
```

With this option, the following code is valid:

```js
if (value != null) {
}
if (value == null) {
}
```

Note: loose equality without `null` (e.g., `if (a == b) {}`) is still flagged regardless of this option.

## Detection Scope

This rule checks the test expression in the following statement types:

- **`if` statements** (`if (condition) {}`)
- **`while` statements** (`while (condition) {}`)
- **`do-while` statements** (`do {} while (condition);`)
- **`for` statements** (`for (; condition; ) {}`)
- **Conditional (ternary) expressions** (`condition ? a : b`)

## When Not To Use It

If your team prefers the conciseness of truthy/falsy checks and is comfortable with JavaScript's type coercion rules, or if you are working with a codebase where implicit conversions are idiomatic.
