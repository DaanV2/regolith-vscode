import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from "vscode-languageclient/node";
import * as path from "path";
import * as vscode from "vscode";
import { Manager } from "../manager/manager";

export function setupClient(context: vscode.ExtensionContext) {
  console.log("starting minecraft language client");

  // The server is implemented in node
  const serverModule = context.asAbsolutePath(path.join("server", "out", "server.js"));

  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  const debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: [
      { scheme: "file", language: "json" },
      { scheme: "file", language: "jsonc" },
    ],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: vscode.workspace.createFileSystemWatcher("**/.clientrc"),
    },
  };

  // Create the language client and start the client.
  Manager.client = new LanguageClient("languageRegolithServer", "LSP Regolith", serverOptions, clientOptions);

  // Start the client. This will also launch the server
  Manager.client.start();

  vscode.commands.executeCommand("setContext", "ext:is_active", true);
}
