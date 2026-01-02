"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, KeyRound, Loader2 } from "lucide-react";

export function ApiKeySection() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateKey() {
    setLoading(true);
    setCopied(false);

    const res = await fetch("/api/api-keys", { method: "POST" });
    const data = await res.json();

    setApiKey(data.key);
    setLoading(false);
  }

  async function copyKey() {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <KeyRound className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">API Key</h3>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground">
        Utilise cette clé pour connecter KajyTime à l’extension VS Code.
        <br />
        ⚠️ Garde-la secrète.
      </p>

      {/* Key display */}
      {apiKey && (
        <div className="flex gap-2">
          <Input value={apiKey} readOnly className="font-mono text-sm" />

          <Button variant="outline" size="icon" onClick={copyKey}>
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Action */}
      <Button onClick={generateKey} disabled={loading} className="w-fit">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Génération…
          </>
        ) : (
          "Générer une API Key"
        )}
      </Button>

      {/* Copied feedback */}
      {copied && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <Check className="h-3 w-3" />
          Copié dans le presse-papiers
        </p>
      )}
    </div>
  );
}
