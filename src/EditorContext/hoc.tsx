import React from "react";
import EditorContext from "./index";

export const withEditor = (Child: any) => (props: any) =>
  (
    <EditorContext.Consumer>
      {(editor) => <Child {...props} editorContext={editor} />}
    </EditorContext.Consumer>
  );
