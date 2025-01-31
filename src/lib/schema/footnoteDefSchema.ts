import { expectDomTypeError } from "@milkdown/exception";
import { $nodeSchema } from "@milkdown/utils";
// import { withMeta } from "@milkdown/preset-gfm/src/__internal__";

const id = "footnote_definition";
const markdownId = "footnoteDefinition";

/// Footnote definition node schema.
export const footnoteDefSchema = $nodeSchema("footnote_definition", () => ({
  group: "block",
  content: "block+",
  defining: true,
  attrs: {
    label: {
      default: "",
    },
  },
  parseDOM: [
    {
      tag: `li[class="footnote-list-item"]`,
      getAttrs: (dom) => {
        if (!(dom instanceof HTMLElement)) throw expectDomTypeError(dom);

        return {
          id: dom.id,
        };
      },
      contentElement: "p",
    },
  ],
  toDOM: (node) => {
    const label = node.attrs.label;
    // const child = node.firstChild?.children;
    // const content = node.content.content[0].content.content[0].text;
    console.log("Def toDom activated... node: ", node);

    return [
      "li",
      {
        // TODO: add a prosemirror plugin to sync label on change
        id: `fn-${label}`,
        class: "footnote-list-item",
        //   "data-label": label,
        //   "data-type": id,
      },
      ["span", 0],
      // content,
      [
        "a",
        {
          class: "footnote-backref",
          href: `#fnref-${label}`,
        },
        " ↩",
      ],
    ];
  },
  parseMarkdown: {
    match: ({ type }) => type === markdownId,
    runner: (state, node, type) => {
      console.log("Def parseMarkdown activated...");
      state
        .openNode(type, {
          label: node.label as string,
        })
        .next(node.children)
        .closeNode();
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === id,
    runner: (state, node) => {
      console.log("Def toMarkdown activated...", node.type.name);
      state
        .openNode(markdownId, undefined, {
          label: node.attrs.label,
          identifier: node.attrs.label,
        })
        .next(node.content)
        .closeNode();
    },
  },
}));

// withMeta(footnoteDefinitionSchema.ctx, {
//   displayName: "NodeSchemaCtx<footnodeDef>",
//   group: "footnote",
// });

// withMeta(footnoteDefinitionSchema.node, {
//   displayName: "NodeSchema<footnodeDef>",
//   group: "footnote",
// });
