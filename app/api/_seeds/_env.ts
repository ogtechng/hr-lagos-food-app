import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Minimal dotenv loader for CLI scripts (Drizzle Kit, seed).
 *
 * Next.js auto-loads `.env.local`, but standalone tooling does not. Parsing the
 * file ourselves (instead of `source`-ing it in the shell) keeps connection
 * strings with `&`, `?`, `$` etc. intact. Existing env vars win, so CI overrides
 * still take precedence.
 */
function loadEnvFile(file: string) {
  let content: string;
  try {
    content = readFileSync(resolve(process.cwd(), file), "utf8");
  } catch {
    return;
  }

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");
