import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/pppp606/eslint-plugin-ai-readable/blob/main/docs/rules/${name}.md`,
);

type MessageIds = "noDoubleNegativeIdentifiers" | "noNegatedNegativeIdentifier";
type Options = [
  {
    negativeWords?: string[];
    allowList?: string[];
    checkProperties?: boolean;
    checkNegatedIdentifiers?: boolean;
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
];

/**
 * Split a camelCase identifier into parts at uppercase boundaries.
 * e.g. "isNotDisabled" -> ["is", "Not", "Disabled"]
 * e.g. "cannotUnregister" -> ["cannot", "Unregister"]
 *
 * Limitations:
 * - Does not handle digits (e.g. "html5Parser" is split as ["html5", "Parser"]).
 * - Does not handle consecutive uppercase / acronyms (e.g. "parseXMLNode" becomes
 *   ["parse", "X", "M", "L", "Node"] instead of ["parse", "XML", "Node"]).
 *   This is acceptable because the primary target is standard camelCase identifiers.
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
 * 3. After finding a negative prefix, check if the remaining camelCase parts
 *    (joined from the start) match any negative word exactly. This avoids
 *    false positives from substring matching.
 * 4. Also check if the remainder starts with another negative prefix
 *    (e.g., "notDisconnect" -> "not" + "dis…").
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
      // The remainder is the parts after the matched prefix.
      const remainderParts = parts.slice(i + 1);
      if (remainderParts.length === 0) continue;
      const remainderLower = remainderParts.map((p) => p.toLowerCase());

      // Check if the remainder matches a negative word at a camelCase boundary.
      // We join consecutive parts from the start and check whether the joined
      // string equals a negative word. This avoids false positives from
      // substring matching (e.g. "invalidated" should not match "invalid").
      for (const word of negativeWords) {
        const lowerWord = word.toLowerCase();
        let joined = "";
        for (const rp of remainderLower) {
          joined += rp;
          if (joined === lowerWord) {
            return true;
          }
        }
      }

      // Also check if the remainder starts with a negative prefix
      // followed by more content (e.g., "notDisconnect" -> "not" + "dis" + "connect")
      const remainderStr = remainderLower.join("");
      for (const prefix of NEGATIVE_PREFIXES) {
        if (
          remainderStr.startsWith(prefix) &&
          remainderStr.length > prefix.length
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Check whether a name contains a negative word at a camelCase boundary.
 *
 * Used for detecting `!isDisabled` patterns where the `!` operator combined
 * with a negative identifier creates a double negative.
 */
function containsNegativeWord(name: string, negativeWords: string[]): boolean {
  const parts = splitCamelCase(name);
  const lowerParts = parts.map((p) => p.toLowerCase());

  // Try joining consecutive parts from each starting position
  // and check if they match a negative word exactly.
  for (let i = 0; i < lowerParts.length; i++) {
    let joined = "";
    for (let j = i; j < lowerParts.length; j++) {
      joined += lowerParts[j];
      for (const word of negativeWords) {
        if (joined === word.toLowerCase()) {
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
      noNegatedNegativeIdentifier:
        "Negating '{{ name }}' with '!' creates a double negative. Use a positive name instead.",
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
          checkNegatedIdentifiers: {
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
    const checkNegatedIdentifiers = options.checkNegatedIdentifiers !== false;

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
      UnaryExpression(node) {
        if (!checkNegatedIdentifiers) return;
        if (node.operator !== "!") return;

        let name: string | undefined;
        if (node.argument.type === "Identifier") {
          name = node.argument.name;
        } else if (
          node.argument.type === "MemberExpression" &&
          !node.argument.computed &&
          node.argument.property.type === "Identifier"
        ) {
          name = node.argument.property.name;
        }

        if (!name) return;
        if (allowList.includes(name)) return;

        if (containsNegativeWord(name, negativeWords)) {
          context.report({
            node,
            messageId: "noNegatedNegativeIdentifier",
            data: { name },
          });
        }
      },
    };
  },
});

export default noDoubleNegativeIdentifiers;
