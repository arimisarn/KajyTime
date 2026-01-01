"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ApiKeySection() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateKey() {
    setLoading(true);
    const res = await fetch("/api/api-keys", { method: "POST" });
    const data = await res.json();
    setApiKey(data.key);
    setLoading(false);
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <h3 className="font-medium">API Key</h3>

      {apiKey ? (
        <Input value={apiKey} readOnly />
      ) : (
        <p className="text-sm text-muted-foreground">
          Génère une clé pour connecter KajyTime à VS Code
        </p>
      )}

      <Button onClick={generateKey} disabled={loading}>
        Générer une API Key
      </Button>
    </div>
  );
}
