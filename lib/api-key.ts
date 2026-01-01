import crypto from "crypto";

export function generateApiKey() {
  return "kajy_" + crypto.randomBytes(32).toString("hex");
}
