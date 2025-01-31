import { $inputRule } from "@milkdown/utils";
import { schemaCtx } from "@milkdown/core";
import { InputRule } from "@milkdown/prose/inputrules";
import { findFootnotesContainer } from "./footnotePlugin";
import { footnoteRefSchema } from "../../schema/footnoteRefSchema";
// import { Node, Schema } from "prosemirror-model";

const fnRefRegEx = /\[\^(\w|[ㄱ-힣])+\](\s|\n)/;
const fnDefRegEx = /\[\^(\w|[ㄱ-힣]|\-)+\]\: .+\n/;

export const fnRefInputRule = $inputRule(
  (ctx) =>
    new InputRule(fnRefRegEx, (state, match, start, end) => {
      const [okay] = match;
      const { tr } = state;

      if (okay) {
        const label = okay.slice(2, okay.length - 2);
        tr.replaceWith(
          start,
          end,
          footnoteRefSchema.type(ctx).create({ label })
        );
      }

      return tr;
    })
);

export const fnDefInputRule = $inputRule(
  (ctx) =>
    new InputRule(fnDefRegEx, (state, match, start, end) => {
      const [okay] = match;
      const { tr } = state;
      const schema = ctx.get(schemaCtx);

      // if (okay) {
      //   const [label, definition] = okay.slice(2).split("]: ");
      //   tr.replaceWith(
      //     start,
      //     end,
      //     footnoteDefinitionSchema
      //       .type(ctx)
      //       .create({ label }, state.schema.text(definition)),
      //   );
      // }

      // return tr;
      console.log("inputrul activated...");

      if (!okay) return null;
      const [label, definition] = okay.slice(2).split("]: ");

      // 각주 내용을 담을 li > p 노드 생성
      const paragraphNode = schema.nodes.paragraph.create(
        null,
        schema.text(label + ": " + definition.trim())
      );
      const listItemNode = schema.nodes.list_item.create(null, paragraphNode);

      // footnotes 컨테이너 찾기
      const footnotesPos = findFootnotesContainer(state.doc);

      if (footnotesPos !== null) {
        // 기존 footnotes 컨테이너에 새 각주 추가
        const footnoteContainer = state.doc.nodeAt(footnotesPos);
        if (footnoteContainer) {
          const orderedList = footnoteContainer.firstChild;

          if (orderedList) {
            const olPos = footnotesPos + 1; // div 다음 위치 === ol 위치
            // footnotesPos + 2 === div > ol 다음 위치 === ol의 firstchild 위치
            const insertPos = olPos + orderedList.nodeSize - 1;
            tr.insert(insertPos, listItemNode);
          }
        }
      } else {
        // footnotes 컨테이너가 없으면 새로 생성
        const orderedList = schema.nodes.ordered_list.create(null, [
          listItemNode,
        ]);
        const footnotesNode = schema.node(
          state.schema.nodes.div,
          { class: "footnotes" },
          orderedList
        );
        console.log("footnotesNode: ", footnotesNode);

        // 문서 끝에 각주 컨테이너 추가
        tr.insert(state.doc.content.size, footnotesNode);
      }

      // 입력된 텍스트 제거
      tr.delete(start, end);

      return tr;
    })
);
