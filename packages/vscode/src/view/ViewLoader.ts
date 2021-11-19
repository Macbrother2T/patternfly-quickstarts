import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { load as yamlLoad } from "js-yaml";
import { Base64 } from 'js-base64';
import { CommandAction, ICommand } from "./app/model";
import { URI } from 'vscode-uri';

export default class ViewLoader {
  private readonly _panel: vscode.WebviewPanel | undefined;
  // @ts-ignore
  private readonly _extensionPath: URI;
  private _disposables: vscode.Disposable[] = [];

  public update(text: string, fileName: string) {
    if (this._panel) {
      const encodedText = this.encodeContent(text, fileName);
      this._panel.webview.html = this.getWebviewContent(encodedText, fileName);
    }
  }

  constructor(text: string, fileName: string, extensionPath: URI) {
    this._extensionPath = extensionPath;

    const encodedText = this.encodeContent(text, fileName);
    if (encodedText) {
      this._panel = vscode.window.createWebviewPanel(
        "configView",
        "Quick Starts Preview",
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.parse(path.join(extensionPath.toString(), "dist")),
          ],
        }
      );

      this._panel.webview.html = this.getWebviewContent(encodedText, fileName);

      this._panel.webview.onDidReceiveMessage(
        (command: ICommand) => {
          switch (command.action) {
            case CommandAction.Save:
              // this.saveFileContent(fileUri, command.content);
              return;
          }
        },
        undefined,
        this._disposables
      );
    }
  }

  private getWebviewContent(config: string, filePath: string): string {
    // Local path to main script run in the webview
    // const reactAppPathOnDisk = vscode.Uri.parse(
    //   path.join(this._extensionPath.toString(), "dist", "quickStarts.js")
    // );
    // const reactAppUri = reactAppPathOnDisk.with({ scheme: "vscode-resource" });
    // <script src="${reactAppUri}"></script>

    // fetch: https://cdn.jsdelivr.net/gh/patternfly/patternfly-quickstarts@main/packages/vscode/dist-cdn/quickStarts.js

    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quick Starts View</title>

        <meta http-equiv="Content-Security-Policy"
                    content="default-src 'self';
                             img-src https:;
                             script-src 'unsafe-eval' https://cdn.jsdelivr.net/gh/patternfly/patternfly-quickstarts@main/packages/vscode/dist-cdn/quickStarts.js 'unsafe-inline' vscode-resource:;
                             style-src vscode-resource: 'unsafe-inline';">

        <script>
          window.acquireVsCodeApi = acquireVsCodeApi;
          window.initialData = "${config}";
          window.filePath = "${filePath}";
        </script>
    </head>
    <body>
        <div id="root"></div>
        <script src="https://cdn.jsdelivr.net/gh/patternfly/patternfly-quickstarts@main/packages/vscode/dist-cdn/quickStarts.js"></script>
    </body>
    </html>`;
    return html;
  }

  private encodeContent(text: string, fileName: string): any {
    if (fileName.endsWith(".yaml")) {
      return Base64.encode(JSON.stringify(yamlLoad(text)));
    }
    return Base64.encode(text);
  }

  // @ts-ignore
  private saveFileContent(fileUri: vscode.Uri, config: string) {
    if (fs.existsSync(fileUri.fsPath)) {
      const content: string = JSON.stringify(config);
      fs.writeFileSync(fileUri.fsPath, content);

      vscode.window.showInformationMessage(
        `👍 Configuration saved to ${fileUri.fsPath}`
      );
    }
  }
}
