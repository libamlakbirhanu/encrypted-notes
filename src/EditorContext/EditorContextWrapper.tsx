import React, { ReactNode, useState } from "react";
import EditorContext from "./index";

type Props = {
  children: ReactNode;
};

function EditorContextWrapper({ children }: Props) {
  const [globalEditor, setGlobalEditor] = useState(null);

  return (
    <EditorContext.Provider value={{ globalEditor, setGlobalEditor }}>
      {children}
    </EditorContext.Provider>
  );
}

export default EditorContextWrapper;
