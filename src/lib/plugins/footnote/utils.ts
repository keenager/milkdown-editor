import { fn_def_id } from "../../schema/footnoteDefSchema";

export function moveFootnotes() {
  let $footnotes = document.querySelector(".footnotes");
  let $ol = $footnotes?.firstElementChild;
  if ($footnotes === null) {
    $footnotes = document.createElement("div");
    $footnotes.className = "milkdown footnotes";
    $ol = document.createElement("ol");
    $ol.className = "list-decimal";
    $footnotes.appendChild($ol);
    document.querySelector(".milkdown")?.appendChild($footnotes);
  }

  const fnDefArr = document.querySelectorAll("." + fn_def_id);
  fnDefArr.forEach((fnDef) => {
    $ol!.appendChild(fnDef);
  });
}
