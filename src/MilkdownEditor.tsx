import React from "react";
import { Milkdown, useEditor } from "@milkdown/react";
import { Crepe } from "@milkdown/crepe";
import { getMarkdown } from "@milkdown/utils";
import { divSchema } from "./lib/schema/divSchema";
import { footnoteRefSchema } from "./lib/schema/footnoteRefSchema";
import { footnoteDefSchema } from "./lib/schema/footnoteDefSchema";
import {
  fnDefInputRule,
  fnRefInputRule,
} from "./lib/plugins/footnote/inputRules";
import { moveFootnotes } from "./lib/plugins/footnote/utils";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/nord-dark.css";
import "./lib/plugins/footnote/style.css";

export const MilkdownEditor: React.FC = () => {
  //@ts-ignore
  const { get } = useEditor((root) => {
    const crepe = new Crepe({ root, defaultValue });
    crepe.editor
      .use(divSchema)
      .use(footnoteRefSchema)
      .use(footnoteDefSchema)
      .use([fnRefInputRule, fnDefInputRule]);
    return crepe;
  });
  moveFootnotes();

  const handleGetMarkdown = () => {
    const markdownOfContents = getMarkdown()(get()!.ctx);
    console.log(markdownOfContents);
  };

  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={handleGetMarkdown}>
        get markdown
      </button>
      <Milkdown />
    </>
  );
};

const defaultValue = `
[TOC]

# table of contents

# 각주
첫 번째 각주[^fn1] 기타 내용

두 번째 각주[^fn2] 기타 내용

[^fn1]: first footnote입니다.

[^fn2]: second footnote입니다.

세 번째 각주[^fn3] 기타 내용

[^fn3]: third footnote, 각주 내 [첫 번째 링크](#first)
각주 내 [두 번째 링크](#second)

# 목차
## Heading-1
**강조 표시**  
*이탤릭*  
## Heading-2
~~취소 표시~~
> 인용 표시
## Heading-3

# 링크
[링크](#)

-----

# 리스트 테스트
1. 리스트1
2. 리스트2
    * 서브리스트1
    * 서브리스트2
        * 서서브리스트1
        * 서서브리스트2
    * 서브리스트3
3. 리스트3
4. 리스트4
5. 리스트5

---

# 테이블 테스트

|#| Column 1 | Column 2 | Column 3 |
|--| -------- | -------- | -------- |
|**1**| Text     | Text     | Text     |
|2| Text     | Text     | Text     |


# 코드 테스트

\`한 줄 전체 code 입니다.\`
인라인 코드 \`inline code\` 입니다.

\`\`\`ts
\`코드 블럭\` 입니다.
\`\`\`


`;
