import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaAppSettingRepository } from "./prisma-app-setting-repository";

const testDatabaseUrl = process.env.DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error("DATABASE_URL must reference the migrated CI test database.");
}

const client = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: testDatabaseUrl }),
});
const repository = new PrismaAppSettingRepository(client);

describe("PrismaAppSettingRepository", () => {
  beforeEach(async () => {
    await client.appSetting.deleteMany();
  });

  afterAll(async () => {
    await client.$disconnect();
  });

  it("stores, updates, and reads a value", async () => {
    await repository.setValue({ key: "locale", value: "de" });
    expect(await repository.findValue("locale")).toBe("de");

    await repository.setValue({ key: "locale", value: "en" });
    expect(await repository.findValue("locale")).toBe("en");
  });

  it("returns null for a missing value and reports deletion", async () => {
    expect(await repository.findValue("missing")).toBeNull();
    expect(await repository.deleteValue("missing")).toBe(false);

    await repository.setValue({ key: "theme", value: "dark" });
    expect(await repository.deleteValue("theme")).toBe(true);
    expect(await repository.findValue("theme")).toBeNull();
  });
});
