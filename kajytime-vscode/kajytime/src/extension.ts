import * as vscode from "vscode";
import { initStatusBar, updateStatusBar } from "./statusBar";
import { sendHeartbeat } from "./heartbeat";

const API_KEY_STORAGE = "kajytimeApiKey";

export function activate(context: vscode.ExtensionContext) {
  console.log("🚀 KajyTime activated");

  // Status bar
  initStatusBar(context);

  // Commande UNIQUE
  const setApiKeyCommand = vscode.commands.registerCommand(
    "kajytime.setApiKey",
    async () => {
      await askForApiKey(context);
    }
  );

  context.subscriptions.push(setApiKeyCommand);

  // 🔥 Demande automatique si pas de clé
  const storedKey = context.globalState.get<string>(API_KEY_STORAGE);
  if (!storedKey) {
    askForApiKey(context);
  }
  const disposable = vscode.workspace.onDidChangeTextDocument((event) => {
    sendHeartbeat(context, event.document);
  });

  context.subscriptions.push(disposable);
}

async function askForApiKey(context: vscode.ExtensionContext) {
  const apiKey = await vscode.window.showInputBox({
    prompt: "Entrer votre API Key KajyTime",
    placeHolder: "kajy_xxxxxxxxxxxxxx",
    ignoreFocusOut: true,
    password: true,
  });

  if (!apiKey) {
    return;
  }

  await context.globalState.update("kajytimeApiKey", apiKey);
  vscode.window.showInformationMessage("API Key enregistrée");

  updateStatusBar(context);
}

export function deactivate() {}
