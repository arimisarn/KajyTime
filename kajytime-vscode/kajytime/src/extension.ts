import * as vscode from "vscode";
import { initStatusBar, updateStatusBar } from "./statusBar";
import { sendHeartbeat } from "./heartbeat";

const API_KEY_STORAGE = "kajytimeApiKey";
const HEARTBEAT_INTERVAL = 30_000; // 30 secondes

let lastHeartbeat = 0;

export function activate(context: vscode.ExtensionContext) {
  console.log("🚀 KajyTime activated");

  // Status bar
  initStatusBar(context);

  // Commande pour définir l’API Key
  const setApiKeyCommand = vscode.commands.registerCommand(
    "kajytime.setApiKey",
    async () => {
      await askForApiKey(context);
    }
  );

  context.subscriptions.push(setApiKeyCommand);

  // Demande automatique si aucune clé n’est stockée
  const storedKey = context.globalState.get<string>(API_KEY_STORAGE);
  if (!storedKey) {
    askForApiKey(context);
  } else {
    updateStatusBar(context);
  }

  // Heartbeat sur activité utilisateur (throttlé)
  const disposable = vscode.workspace.onDidChangeTextDocument(() => {
    const now = Date.now();
    if (now - lastHeartbeat > HEARTBEAT_INTERVAL) {
      lastHeartbeat = now;
      sendHeartbeat(context);
    }
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

  await context.globalState.update(API_KEY_STORAGE, apiKey);

  vscode.window.showInformationMessage("✅ API Key KajyTime enregistrée");
  updateStatusBar(context);
}

export function deactivate() {
  console.log("🛑 KajyTime désactivé");
}
