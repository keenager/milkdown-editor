import { $nodeSchema } from "@milkdown/utils";

export const divSchema = $nodeSchema("div", () => ({
  content: "block+",
  group: "block",
  attrs: { class: { default: null } },
  parseDOM: [
    { tag: "div", getAttrs: (dom) => ({ class: dom.getAttribute("class") }) },
  ],
  toDOM(node) {
    return ["div", { class: node.attrs.class }, 0];
  },
  parseMarkdown: {
    match: (node) => node.type === "container" && node.meta === "div",
    runner: (state, node, type) => {
      state.openNode(type);
      state.next(node.children);
      state.closeNode();
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === "div",
    runner: (state, node) => {
      state.addNode("container", undefined, undefined, {
        meta: "div",
        attrs: {
          id: node.attrs.id,
          style: node.attrs.style,
        },
      });
    },
  },
}));
