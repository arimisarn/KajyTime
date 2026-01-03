import * as vscode from "vscode";
import { initStatusBar, updateStatusBar } from "./statusBar";
import { sendHeartbeat } from "./heartbeat";

const API_KEY_STORAGE = "kajytimeApiKey";
const HEARTBEAT_INTERVAL = 30_000; // 30 secondes
const IDLE_DELAY = 2 * 60 * 1000; // 2 minutes

let lastHeartbeat = 0;
let isIdle = false;
let idleTimeout: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log("🚀 KajyTime activated");

  // Status bar
  initStatusBar(context);

  // Commande API Key
  const setApiKeyCommand = vscode.commands.registerCommand(
    "kajytime.setApiKey",
    async () => {
      await askForApiKey(context);
    }
  );
  context.subscriptions.push(setApiKeyCommand);

  // Demande auto si clé absente
  const storedKey = context.globalState.get<string>(API_KEY_STORAGE);
  if (!storedKey) {
    askForApiKey(context);
  } else {
    updateStatusBar(context);
  }

  // Reset idle au démarrage
  resetIdleTimer();

  // ✍️ Activité utilisateur (édition)
  const textChangeDisposable = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      resetIdleTimer();

      if (isIdle) return;

      const now = Date.now();
      if (now - lastHeartbeat > HEARTBEAT_INTERVAL) {
        lastHeartbeat = now;
        sendHeartbeat(context, event.document);
      }
    }
  );

  // 🖥 Focus fenêtre VS Code
  const windowFocusDisposable = vscode.window.onDidChangeWindowState(
    (state) => {
      if (!state.focused) {
        isIdle = true;
        console.log("⏸ KajyTime paused (window unfocused)");
      } else {
        resetIdleTimer();
      }
    }
  );

  context.subscriptions.push(textChangeDisposable, windowFocusDisposable);
}

function resetIdleTimer() {
  isIdle = false;

  if (idleTimeout) {
    clearTimeout(idleTimeout);
  }

  idleTimeout = setTimeout(() => {
    isIdle = true;
    console.log("⏸ KajyTime idle");
  }, IDLE_DELAY);
}

async function askForApiKey(context: vscode.ExtensionContext) {
  const apiKey = await vscode.window.showInputBox({
    prompt: "Entrer votre API Key KajyTime",
    placeHolder: "kajy_xxxxxxxxxxxxxx",
    ignoreFocusOut: true,
    password: true,
  });

  if (!apiKey) return;

  await context.globalState.update(API_KEY_STORAGE, apiKey);
  vscode.window.showInformationMessage("API Key KajyTime enregistrée");
  updateStatusBar(context);
}

export function deactivate() {
  console.log("KajyTime désactivé");
}
