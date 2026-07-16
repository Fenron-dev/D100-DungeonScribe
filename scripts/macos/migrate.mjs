import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const databasePath = process.env.DUNGEONSCRIBE_DB_PATH;
if (!databasePath) {
  throw new Error("DUNGEONSCRIBE_DB_PATH is required.");
}

const bundleDirectory = dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = join(bundleDirectory, "prisma", "migrations");

mkdirSync(dirname(databasePath), { recursive: true });

const database = new Database(databasePath);
database.pragma("foreign_keys = ON");
database.pragma("busy_timeout = 5000");
database.exec(`
  CREATE TABLE IF NOT EXISTS "_DungeonScribeMigration" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const appliedMigration = database.prepare(
  'SELECT 1 FROM "_DungeonScribeMigration" WHERE "name" = ?',
);
const recordMigration = database.prepare(
  'INSERT INTO "_DungeonScribeMigration" ("name") VALUES (?)',
);
const applyMigration = database.transaction((name, sql) => {
  database.exec(sql);
  recordMigration.run(name);
});

try {
  const migrations = readdirSync(migrationsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const migration of migrations) {
    if (appliedMigration.get(migration)) {
      continue;
    }

    const sql = readFileSync(
      join(migrationsDirectory, migration, "migration.sql"),
      "utf8",
    );
    applyMigration(migration, sql);
    process.stdout.write(`Migration applied: ${migration}\n`);
  }
} finally {
  database.close();
}
