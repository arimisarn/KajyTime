import * as vscode from "vscode";
import fetch from "node-fetch";

export async function sendHeartbeat(context: vscode.ExtensionContext) {
  const apiKey = context.globalState.get<string>("kajytimeApiKey");
  if (!apiKey) {
    return;
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const payload = {
    file: editor.document.fileName,
    language: editor.document.languageId,
    project: vscode.workspace.name,
  };

  try {
    await fetch("http://localhost:3000/api/heartbeat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("KajyTime heartbeat error", e);
  }
}
