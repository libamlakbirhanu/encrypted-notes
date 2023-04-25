import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import EditorContextWrapper from "./EditorContext/EditorContextWrapper";

import "./global.css";
import "normalize.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <EditorContextWrapper>
      <App />
    </EditorContextWrapper>
  </React.StrictMode>
);
