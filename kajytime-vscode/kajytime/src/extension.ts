import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const apiKey = vscode.workspace
    .getConfiguration("kajytime")
    .get<string>("apiKey");

  if (!apiKey) {
    vscode.window.showWarningMessage(
      "KajyTime : veuillez entrer votre API Key dans les paramètres. (Generer votre api key dans : https://kajytime.vercel.app/api-key)"
    );
  } else {
    vscode.window.showInformationMessage("KajyTime connecté ");
  }
}
