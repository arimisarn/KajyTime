import * as vscode from "vscode";

const HEARTBEAT_INTERVAL = 120; // secondes
const lastHeartbeats = new Map<string, number>();

export async function sendHeartbeat(
  context: vscode.ExtensionContext,
  document: vscode.TextDocument
) {
  const apiKey = context.globalState.get<string>("kajytimeApiKey");
  if (!apiKey) return;

  const file = document.fileName;
  const now = Math.floor(Date.now() / 1000);
  const last = lastHeartbeats.get(file);

  // 🛑 Anti-spam
  if (last && now - last < HEARTBEAT_INTERVAL) {
    return;
  }

  lastHeartbeats.set(file, now);

  const payload = {
    apiKey,
    file,
    language: document.languageId,
    timestamp: now,
  };

  try {
    await fetch("http://localhost:3000/api/heartbeat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("KajyTime heartbeat error", err);
  }
}
