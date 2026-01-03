import * as vscode from "vscode";

export async function sendHeartbeat(
  context: vscode.ExtensionContext,
  document: vscode.TextDocument
) {
  if (document.isUntitled) {
    return;
  }

  const apiKey = context.globalState.get<string>("kajytimeApiKey");
  if (!apiKey) {
    return;
  }

  const payload = {
    file: document.fileName,
    language: document.languageId,
    project: vscode.workspace.name,
    timestamp: new Date().toISOString(),
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
  } catch (error) {
    console.error("KajyTime heartbeat error", error);
  }
}
