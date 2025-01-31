import { MilkdownEditor } from "./MilkdownEditor";
import { MilkdownProvider } from "@milkdown/react";

function App() {
  // const getMark = () => {
  //   const mark = crepe.getMarkdown();
  //   console.log(mark);
  // };
  return (
    <MilkdownProvider>
      <h1>Milkdown Editor</h1>

      <MilkdownEditor />
    </MilkdownProvider>
  );
}

export default App;
