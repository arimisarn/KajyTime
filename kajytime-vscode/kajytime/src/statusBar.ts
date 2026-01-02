import * as vscode from "vscode";

let statusBarItem: vscode.StatusBarItem;

export function initStatusBar(context: vscode.ExtensionContext) {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );

  statusBarItem.command = "kajytime.setApiKey";
  context.subscriptions.push(statusBarItem);

  updateStatusBar(context);
  statusBarItem.show();
}

export function updateStatusBar(context: vscode.ExtensionContext) {
  const apiKey = context.globalState.get<string>("kajytimeApiKey");

  if (!apiKey) {
    statusBarItem.text = "⚠️ KajyTime: No API Key";
    statusBarItem.tooltip = "Cliquer pour entrer votre API Key KajyTime";
  } else {
    statusBarItem.text = "🟢 KajyTime: Tracking";
    statusBarItem.tooltip = "KajyTime est actif";
  }
}
