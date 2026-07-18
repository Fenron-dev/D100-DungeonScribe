import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomUUID,
  scryptSync,
  type BinaryLike,
} from "node:crypto";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  aiProfileVaultSchema,
  emptyAiProfileVault,
  type AiProfileVault,
} from "@/domain/ai-profile";
import { prisma } from "@/db/prisma";
import { PrismaAppSettingRepository } from "@/repositories/prisma/prisma-app-setting-repository";

const settingKey = "ai.encrypted-profile-vault";
const sessionCookie = "d100-ai-session";
const sessionLifetimeMs = 12 * 60 * 60 * 1000;
const repository = new PrismaAppSettingRepository(prisma);

const envelopeSchema = z.object({
  version: z.literal(1),
  salt: z.string(),
  iv: z.string(),
  tag: z.string(),
  ciphertext: z.string(),
});

interface UnlockSession { key: Buffer; touchedAt: number }
const globalSessions = globalThis as typeof globalThis & {
  dungeonScribeUnlockSessions?: Map<string, UnlockSession>;
};
const sessions = globalSessions.dungeonScribeUnlockSessions ?? new Map<string, UnlockSession>();
globalSessions.dungeonScribeUnlockSessions = sessions;

function deriveKey(password: BinaryLike, salt: Buffer): Buffer {
  return scryptSync(password, salt, 32, { N: 16_384, r: 8, p: 1 });
}

function encrypt(vault: AiProfileVault, key: Buffer, salt: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(vault), "utf8"), cipher.final()]);
  return JSON.stringify({
    version: 1,
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  });
}

function decrypt(serialized: string, key: Buffer): AiProfileVault {
  const envelope = envelopeSchema.parse(JSON.parse(serialized));
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(envelope.iv, "base64"));
  decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(envelope.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
  return aiProfileVaultSchema.parse(JSON.parse(plaintext));
}

async function session(): Promise<{ id: string; key: Buffer } | null> {
  const id = (await cookies()).get(sessionCookie)?.value;
  if (!id) return null;
  const unlocked = sessions.get(id);
  if (!unlocked) return null;
  if (Date.now() - unlocked.touchedAt > sessionLifetimeMs) {
    unlocked.key.fill(0);
    sessions.delete(id);
    return null;
  }
  unlocked.touchedAt = Date.now();
  return { id, key: unlocked.key };
}

export async function hasEncryptedProfileVault(): Promise<boolean> {
  return (await repository.findValue(settingKey)) !== null;
}

export async function isAiProfileVaultUnlocked(): Promise<boolean> {
  return (await session()) !== null;
}

export async function createEncryptedProfileVault(password: string): Promise<void> {
  if (password.length < 10 || password.length > 200 || await hasEncryptedProfileVault()) {
    throw new Error("Invalid setup");
  }
  const salt = randomBytes(16);
  const key = deriveKey(password, salt);
  try {
    await repository.setValue({ key: settingKey, value: encrypt(emptyAiProfileVault, key, salt) });
  } catch (error) {
    key.fill(0);
    throw error;
  }
  await establishSession(key);
}

export async function unlockAiProfileVault(password: string): Promise<void> {
  if (password.length > 200) throw new Error("Invalid password");
  const serialized = await repository.findValue(settingKey);
  if (!serialized) throw new Error("Vault missing");
  const envelope = envelopeSchema.parse(JSON.parse(serialized));
  const key = deriveKey(password, Buffer.from(envelope.salt, "base64"));
  try {
    decrypt(serialized, key);
  } catch (error) {
    key.fill(0);
    throw error;
  }
  await establishSession(key);
}

async function establishSession(key: Buffer): Promise<void> {
  const now = Date.now();
  for (const [id, unlocked] of sessions) {
    if (now - unlocked.touchedAt > sessionLifetimeMs) {
      unlocked.key.fill(0);
      sessions.delete(id);
    }
  }
  const previousId = (await cookies()).get(sessionCookie)?.value;
  const previous = previousId ? sessions.get(previousId) : null;
  if (previousId && previous) {
    previous.key.fill(0);
    sessions.delete(previousId);
  }
  const id = randomUUID();
  sessions.set(id, { key, touchedAt: now });
  (await cookies()).set(sessionCookie, id, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    path: "/",
    maxAge: sessionLifetimeMs / 1000,
  });
}

export async function lockAiProfileVault(): Promise<void> {
  const current = await session();
  if (current) {
    current.key.fill(0);
    sessions.delete(current.id);
  }
  (await cookies()).delete(sessionCookie);
}

export async function loadAiProfileVault(): Promise<AiProfileVault | null> {
  const current = await session();
  const serialized = await repository.findValue(settingKey);
  if (!current || !serialized) return null;
  return decrypt(serialized, current.key);
}

export async function loadActiveAiProfile() {
  const vault = await loadAiProfileVault();
  return vault?.profiles.find(({ id }) => id === vault.activeProfileId) ?? null;
}

export async function saveAiProfileVault(vault: AiProfileVault): Promise<void> {
  const current = await session();
  const serialized = await repository.findValue(settingKey);
  if (!current || !serialized) throw new Error("Vault locked");
  const envelope = envelopeSchema.parse(JSON.parse(serialized));
  const salt = Buffer.from(envelope.salt, "base64");
  await repository.setValue({
    key: settingKey,
    value: encrypt(aiProfileVaultSchema.parse(vault), current.key, salt),
  });
}

export async function resetEncryptedProfileVault(): Promise<void> {
  await lockAiProfileVault();
  await repository.deleteValue(settingKey);
}
