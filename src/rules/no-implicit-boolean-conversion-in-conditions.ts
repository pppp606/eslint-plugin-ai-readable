import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/pppp606/eslint-plugin-ai-readable/blob/main/docs/rules/${name}.md`,
);

type MessageIds = "noImplicitBooleanConversion";
type Options = [
  {
    allowBooleanIdentifiers?: boolean;
    allowNullishCheck?: boolean;
  },
];

const BOOLEAN_PREFIX_PATTERN = /^(is|has|should|can|will|was|did)[A-Z]/;

const COMPARISON_OPERATORS = new Set([
  "===",
  "!==",
  "<",
  ">",
  "<=",
  ">=",
  "instanceof",
  "in",
]);

function isNullLiteral(node: TSESTree.Expression): boolean {
  return node.type === "Literal" && node.value === null;
}

function isExplicitBoolean(
  node: TSESTree.Expression,
  allowBooleanIdentifiers: boolean,
  allowNullishCheck: boolean,
): boolean {
  switch (node.type) {
    case "BinaryExpression":
      if (COMPARISON_OPERATORS.has(node.operator)) {
        return true;
      }
      if (node.operator === "==" || node.operator === "!=") {
        if (
          allowNullishCheck &&
          (isNullLiteral(node.left) || isNullLiteral(node.right))
        ) {
          return true;
        }
        return false;
      }
      return false;

    case "LogicalExpression":
      return (
        isExplicitBoolean(
          node.left,
          allowBooleanIdentifiers,
          allowNullishCheck,
        ) &&
        isExplicitBoolean(
          node.right,
          allowBooleanIdentifiers,
          allowNullishCheck,
        )
      );

    case "UnaryExpression":
      if (node.operator === "!") {
        return isExplicitBoolean(
          node.argument,
          allowBooleanIdentifiers,
          allowNullishCheck,
        );
      }
      return false;

    case "Literal":
      return typeof node.value === "boolean";

    case "Identifier":
      if (allowBooleanIdentifiers && BOOLEAN_PREFIX_PATTERN.test(node.name)) {
        return true;
      }
      return false;

    case "MemberExpression":
      if (
        allowBooleanIdentifiers &&
        !node.computed &&
        node.property.type === "Identifier" &&
        BOOLEAN_PREFIX_PATTERN.test(node.property.name)
      ) {
        return true;
      }
      return false;

    default:
      return false;
  }
}

/**
 * Collect all non-explicit leaf nodes from a LogicalExpression tree.
 * Instead of reporting the whole LogicalExpression, we report each
 * individual operand that is not explicitly boolean.
 */
function collectImplicitNodes(
  node: TSESTree.Expression,
  allowBooleanIdentifiers: boolean,
  allowNullishCheck: boolean,
  results: TSESTree.Node[],
): void {
  if (node.type === "LogicalExpression") {
    collectImplicitNodes(
      node.left,
      allowBooleanIdentifiers,
      allowNullishCheck,
      results,
    );
    collectImplicitNodes(
      node.right,
      allowBooleanIdentifiers,
      allowNullishCheck,
      results,
    );
  } else {
    if (!isExplicitBoolean(node, allowBooleanIdentifiers, allowNullishCheck)) {
      results.push(node);
    }
  }
}

const noImplicitBooleanConversionInConditions = createRule<Options, MessageIds>(
  {
    name: "no-implicit-boolean-conversion-in-conditions",
    meta: {
      type: "suggestion",
      docs: {
        description:
          "Disallow implicit boolean conversions in conditional expressions",
      },
      messages: {
        noImplicitBooleanConversion:
          "Avoid implicit boolean conversion. Use an explicit comparison instead (e.g., value !== null, items.length > 0).",
      },
      schema: [
        {
          type: "object",
          properties: {
            allowBooleanIdentifiers: {
              type: "boolean",
            },
            allowNullishCheck: {
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
      const allowBooleanIdentifiers = options.allowBooleanIdentifiers ?? false;
      const allowNullishCheck = options.allowNullishCheck ?? false;

      function checkCondition(test: TSESTree.Expression): void {
        if (
          test.type === "UnaryExpression" &&
          test.operator === "!" &&
          test.argument.type === "LogicalExpression"
        ) {
          const implicitNodes: TSESTree.Node[] = [];
          collectImplicitNodes(
            test.argument,
            allowBooleanIdentifiers,
            allowNullishCheck,
            implicitNodes,
          );
          for (const node of implicitNodes) {
            context.report({
              node,
              messageId: "noImplicitBooleanConversion",
            });
          }
        } else if (test.type === "LogicalExpression") {
          const implicitNodes: TSESTree.Node[] = [];
          collectImplicitNodes(
            test,
            allowBooleanIdentifiers,
            allowNullishCheck,
            implicitNodes,
          );
          for (const node of implicitNodes) {
            context.report({
              node,
              messageId: "noImplicitBooleanConversion",
            });
          }
        } else {
          if (
            !isExplicitBoolean(test, allowBooleanIdentifiers, allowNullishCheck)
          ) {
            context.report({
              node: test,
              messageId: "noImplicitBooleanConversion",
            });
          }
        }
      }

      return {
        IfStatement(node) {
          checkCondition(node.test);
        },
        WhileStatement(node) {
          checkCondition(node.test);
        },
        DoWhileStatement(node) {
          checkCondition(node.test);
        },
        ForStatement(node) {
          if (node.test) {
            checkCondition(node.test);
          }
        },
        ConditionalExpression(node) {
          checkCondition(node.test);
        },
      };
    },
  },
);

export default noImplicitBooleanConversionInConditions;
