"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // évite le mismatch SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Paramètres</h1>
            <p className="text-sm text-muted-foreground">
              Gérez les préférences de votre application
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>
                Choisissez entre le mode clair et sombre
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}

                  <Label htmlFor="theme-switch" className="text-sm font-medium">
                    Mode sombre
                  </Label>
                </div>

                <Switch
                  id="theme-switch"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => {
                    document.documentElement.classList.add("theme-transition");

                    setTheme(checked ? "dark" : "light");

                    setTimeout(() => {
                      document.documentElement.classList.remove(
                        "theme-transition"
                      );
                    }, 300);
                  }}
                />
                <Link
                  href="/settings/api-key"
                  className="rounded-lg border p-4 hover:bg-muted transition"
                >
                  <h3 className="font-medium">API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    Connecter KajyTime à VS Code
                  </p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
