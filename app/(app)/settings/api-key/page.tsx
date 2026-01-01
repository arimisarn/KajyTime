import { ApiKeySection } from "../../settings/api-key";

export default function ApiKeyPage() {
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">API Key</h1>
      <ApiKeySection />
    </div>
  );
}
