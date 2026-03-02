import { ESLintUtils } from "@typescript-eslint/utils";

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
    return {
      VariableDeclarator(node) {
        if (node.id.type === "Identifier" && node.id.name.length === 1) {
          context.report({
            node: node.id,
            messageId: "noSingleLetterVariables",
            data: {
              name: node.id.name,
            },
          });
        }
      },
    };
  },
});

export default noSingleLetterVariables;
