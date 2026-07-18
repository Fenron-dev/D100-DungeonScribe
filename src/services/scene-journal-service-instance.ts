import { prisma } from "@/db/prisma";
import { PrismaSceneJournalRepository } from "@/repositories/prisma/prisma-scene-journal-repository";
import { CryptoRandomSource } from "@/rules/random-source";
import { D6PoolRuleEngine } from "@/rules/rule-engine";
import { coreAdventureRuleset } from "@/rules/ruleset";
import { SceneJournalService } from "@/services/scene-journal-service";

export const sceneJournalService = new SceneJournalService(
  new PrismaSceneJournalRepository(prisma),
  new D6PoolRuleEngine(new CryptoRandomSource()),
  coreAdventureRuleset,
);
