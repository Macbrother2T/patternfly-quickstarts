// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import ViewLoader from "./view/ViewLoader";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('VSCode extension "quickstarts-preview" is now active!');

  let view: any;

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "extension.qsPreview",
    () => {
      view = new ViewLoader(
        vscode.window.activeTextEditor?.document.getText() as string,
        vscode.window.activeTextEditor?.document.fileName as string,
        context.extensionUri
      );
    }
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      if (
        isQuickStartsFile(vscode.window.activeTextEditor?.document.fileName)
      ) {
        view && view.update(document.getText() as string, document.fileName as string);
        // view = new ViewLoader(
        //   document.getText() as string,
        //   document.fileName as string,
        //   context.extensionPath
        // );
      }
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}

export function isQuickStartsFile(file?: string) {
  if (!file) {
    return false;
  }
  return file.endsWith(".yaml") || file.endsWith(".adoc");
}