import { Ctx, MilkdownPlugin } from "@milkdown/ctx";
import { Node } from "@milkdown/prose/model";
import { listenerCtx } from "@milkdown/plugin-listener";

export const footnotePlugin: MilkdownPlugin = (ctx: Ctx) => {
  return () => {
    // ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {

    setTimeout(() => {
      // footnotes 컨테이너 찾기
      //   const footnotesPos = findFootnotesContainer(doc);
    }, 1000);

    // });
  };
};

// 각주 컨테이너를 찾는 함수
export function findFootnotesContainer(doc: Node) {
  let footnotesPos: number | null = null;

  doc.forEach((node, pos) => {
    if (node.type.name === "div" && node.attrs.class === "footnotes") {
      footnotesPos = pos;
      return false; // 찾았으면 순회 중단
    }
  });
  return footnotesPos;
}
