import * as React from "react";
import * as ReactDOM from "react-dom";

import "./index.css";
import { QuickStartsPreview } from "./quickstarts";

const vscode = window.acquireVsCodeApi();

ReactDOM.render(
  <QuickStartsPreview vscode={vscode} initialData={window.initialData} filePath={window.filePath} />,
  document.getElementById("root")
);
