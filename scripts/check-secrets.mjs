import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";

const excludedPaths = new Set([
  "package-lock.json",
  "scripts/check-secrets.mjs",
]);

const textFilePattern = /(?:\.(?:c?js|mjs|ts|tsx|json|md|css|scss|prisma|sql|toml|ya?ml|txt|example)|(?:^|\/)\.git(?:ignore|attributes))$/i;

const checks = [
  {
    name: "private key",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
  {
    name: "OpenAI API key",
    pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/,
  },
  {
    name: "GitHub token",
    pattern: /\b(?:ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/,
  },
  {
    name: "AWS access key",
    pattern: /\bAKIA[0-9A-Z]{16}\b/,
  },
  {
    name: "personal home path",
    pattern: /(?:\/Users\/[^/\s]+\/|[A-Za-z]:\\Users\\[^\\\s]+\\)/,
  },
  {
    name: "email address",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  },
  {
    name: "probable credential assignment",
    pattern:
      /(?:api[_-]?key|password|passwd|access[_-]?token|client[_-]?secret)\s*[:=]\s*["'][^"'\n]{12,}["']/i,
  },
];

function listTrackedFiles() {
  try {
    const output = execFileSync("git", ["ls-files", "-z"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });

    return output.split("\0").filter(Boolean);
  } catch {
    throw new Error("Secret scan requires a Git repository with tracked files.");
  }
}

const findings = [];

for (const filePath of listTrackedFiles()) {
  if (excludedPaths.has(filePath) || !textFilePattern.test(filePath)) {
    continue;
  }

  if (statSync(filePath).size > 1_000_000) {
    continue;
  }

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const check of checks) {
      if (check.pattern.test(line)) {
        findings.push(`${filePath}:${index + 1} – ${check.name}`);
      }
    }
  });
}

if (findings.length > 0) {
  console.error("Potential secrets or personal paths detected:\n");
  console.error(findings.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Secret scan passed.");
}
