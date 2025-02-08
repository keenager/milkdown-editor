import { expectDomTypeError } from "@milkdown/exception";
import { $nodeSchema } from "@milkdown/utils";
// import { withMeta } from "@milkdown/preset-gfm/src/__internal__";

export const fn_ref_id = "footnote_reference";
const markdownId = "footnoteReference";

/// Footnote reference node schema.
export const footnoteRefSchema = $nodeSchema(fn_ref_id, () => ({
  group: "inline",
  content: "text*",
  inline: true,
  atom: true,
  attrs: {
    label: {
      default: "",
    },
  },
  parseDOM: [
    {
      tag: `sup[data-type="${fn_ref_id}"]`,
      getAttrs: (dom) => {
        if (!(dom instanceof HTMLElement)) throw expectDomTypeError(dom);
        console.log("Ref parseDom activated... dom: ", dom);
        return {
          id: dom.id,
          label: dom.dataset.label,
        };
      },
      contentElement: "a",
    },
  ],
  toDOM: (node) => {
    console.log("Ref toDOM activated... node: ", node);
    const label = node.attrs.label;
    return [
      "sup",
      {
        // TODO: add a prosemirror plugin to sync label on change
        id: `fnref-${label}`,
        "data-label": label,
        "data-type": fn_ref_id,
      },
      [
        "a",
        {
          href: `#fn-${label}`,
        },
        `[${label}]`,
      ],
    ];
  },
  parseMarkdown: {
    match: ({ type }) => type === markdownId,
    runner: (state, node, type) => {
      console.log("Ref parseMarkdown activated...");
      state.addNode(type, {
        label: node.label as string,
      });
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === fn_ref_id,
    runner: (state, node) => {
      console.log("Ref toMarkdown activated...", node.attrs.label);
      state.addNode(markdownId, undefined, undefined, {
        label: node.attrs.label,
        identifier: node.attrs.label,
      });
    },
  },
}));

// withMeta(footnoteRefSchema.ctx, {
//   displayName: "NodeSchemaCtx<footnodeRef>",
//   group: "footnote",
// });

// withMeta(footnoteRefSchema.node, {
//   displayName: "NodeSchema<footnodeRef>",
//   group: "footnote",
// });
