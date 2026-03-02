import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/pppp606/eslint-plugin-ai-readable/blob/main/docs/rules/${name}.md`,
);

type MessageIds = "noDoubleNegativeIdentifiers";
type Options = [
  {
    negativeWords?: string[];
    allowList?: string[];
    checkProperties?: boolean;
  },
];

const NEGATIVE_PREFIXES = [
  "not",
  "no",
  "un",
  "dis",
  "in",
  "im",
  "non",
  "cannot",
];

const DEFAULT_NEGATIVE_WORDS = [
  "disabled",
  "invalid",
  "unknown",
  "unavailable",
  "inactive",
  "unregistered",
  "unauthorized",
  "unregister",
  "disconnect",
  "disapprove",
  "incomplete",
  "impossible",
  "nonsense",
  "noncompliant",
];

/**
 * Split a camelCase identifier into parts at uppercase boundaries.
 * e.g. "isNotDisabled" -> ["is", "Not", "Disabled"]
 * e.g. "cannotUnregister" -> ["cannot", "Unregister"]
 */
function splitCamelCase(name: string): string[] {
  const parts: string[] = [];
  let current = "";
  for (let i = 0; i < name.length; i++) {
    const ch = name[i];
    if (ch >= "A" && ch <= "Z" && current.length > 0) {
      parts.push(current);
      current = ch;
    } else {
      current += ch;
    }
  }
  if (current.length > 0) {
    parts.push(current);
  }
  return parts;
}

/**
 * Check whether a name contains a double negative.
 *
 * Strategy:
 * 1. Split the identifier into camelCase parts.
 * 2. Scan from left to find a negative prefix among the parts.
 * 3. After finding a negative prefix, check if the remaining portion
 *    (joined back together, lowercased) contains any negative word from
 *    the negativeWords list.
 */
function hasDoubleNegative(name: string, negativeWords: string[]): boolean {
  const parts = splitCamelCase(name);
  const lowerParts = parts.map((p) => p.toLowerCase());

  // Try to find a negative prefix at various positions in the parts.
  // The prefix could be a standalone part or a prefix of the first few parts joined.
  for (let i = 0; i < lowerParts.length; i++) {
    // Check if lowerParts[i] is a negative prefix
    const part = lowerParts[i];
    const matchedPrefix = NEGATIVE_PREFIXES.find((prefix) => part === prefix);
    if (matchedPrefix) {
      // The remainder starts after this part
      const remainder = parts
        .slice(i + 1)
        .join("")
        .toLowerCase();
      if (remainder.length === 0) continue;

      // Check if the remainder itself contains a negative word
      for (const word of negativeWords) {
        if (remainder.includes(word.toLowerCase())) {
          return true;
        }
      }

      // Also check if the remainder starts with a negative prefix
      // followed by more content (e.g., "Unregister" -> "un" + "register")
      for (const prefix of NEGATIVE_PREFIXES) {
        if (remainder.startsWith(prefix) && remainder.length > prefix.length) {
          return true;
        }
      }
    }
  }

  return false;
}

const noDoubleNegativeIdentifiers = createRule<Options, MessageIds>({
  name: "no-double-negative-identifiers",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow double negative identifier names for better readability",
    },
    messages: {
      noDoubleNegativeIdentifiers:
        "Identifier '{{ name }}' contains a double negative. Use a positive name instead.",
    },
    schema: [
      {
        type: "object",
        properties: {
          negativeWords: {
            type: "array",
            items: { type: "string" },
          },
          allowList: {
            type: "array",
            items: { type: "string" },
          },
          checkProperties: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context) {
    const options = context.options[0] || {};
    const additionalNegativeWords = options.negativeWords || [];
    const allowList = options.allowList || [];
    const checkProperties = options.checkProperties !== false;

    const negativeWords = [
      ...DEFAULT_NEGATIVE_WORDS,
      ...additionalNegativeWords,
    ];

    function checkIdentifier(name: string, node: TSESTree.Node): void {
      if (allowList.includes(name)) return;
      if (hasDoubleNegative(name, negativeWords)) {
        context.report({
          node,
          messageId: "noDoubleNegativeIdentifiers",
          data: { name },
        });
      }
    }

    return {
      VariableDeclarator(node) {
        if (node.id.type === "Identifier") {
          checkIdentifier(node.id.name, node.id);
        }
      },
      FunctionDeclaration(node) {
        if (node.id) {
          checkIdentifier(node.id.name, node.id);
        }
      },
      FunctionExpression(node) {
        if (node.id) {
          checkIdentifier(node.id.name, node.id);
        }
      },
      MethodDefinition(node) {
        if (node.key.type === "Identifier") {
          checkIdentifier(node.key.name, node.key);
        }
      },
      Property(node) {
        if (!checkProperties) return;
        if (node.key.type === "Identifier") {
          checkIdentifier(node.key.name, node.key);
        }
      },
    };
  },
});

export default noDoubleNegativeIdentifiers;
