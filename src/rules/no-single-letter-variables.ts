import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/takuto/eslint-plugin-ai-readable/blob/main/docs/rules/${name}.md`,
);

type MessageIds = "noSingleLetterVariables";
type Options = [];

const noSingleLetterVariables = createRule<Options, MessageIds>({
  name: "no-single-letter-variables",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow single-letter variable names for better readability",
    },
    messages: {
      noSingleLetterVariables:
        "Variable name '{{ name }}' is too short. Use a descriptive name instead of a single letter.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    function reportIfSingleLetter(node: TSESTree.Node): void {
      if (node.type === "Identifier" && node.name.length === 1) {
        context.report({
          node,
          messageId: "noSingleLetterVariables",
          data: { name: node.name },
        });
      }
    }

    function checkPattern(pattern: TSESTree.Node): void {
      switch (pattern.type) {
        case "Identifier":
          reportIfSingleLetter(pattern);
          break;
        case "ObjectPattern":
          for (const prop of pattern.properties) {
            if (prop.type === "Property") {
              checkPattern(prop.value);
            } else {
              checkPattern(prop);
            }
          }
          break;
        case "ArrayPattern":
          for (const element of pattern.elements) {
            if (element) {
              checkPattern(element);
            }
          }
          break;
        case "AssignmentPattern":
          checkPattern(pattern.left);
          break;
      }
    }

    return {
      VariableDeclarator(node) {
        checkPattern(node.id);
      },
    };
  },
});

export default noSingleLetterVariables;
