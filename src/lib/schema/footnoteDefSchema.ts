import { expectDomTypeError } from "@milkdown/exception";
import { $nodeSchema } from "@milkdown/utils";
// import { withMeta } from "@milkdown/preset-gfm/src/__internal__";

export const fn_def_id = "footnote_definition";
const markdownId = "footnoteDefinition";

/// Footnote definition node schema.
export const footnoteDefSchema = $nodeSchema(fn_def_id, () => ({
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
      tag: `li[class=${fn_def_id}]`,
      getAttrs: (dom) => {
        if (!(dom instanceof HTMLElement)) throw expectDomTypeError(dom);

        return {
          id: dom.id,
          label: dom.dataset.label,
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
        class: fn_def_id,
        "data-label": label,
        //   "data-type": fn_def_id,
      },
      ["span", { class: "footnote-content" }, 0],
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
    match: (node) => node.type.name === fn_def_id,
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
