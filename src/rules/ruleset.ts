import { z } from "zod";

const checkMechanicSchema = z
  .object({
    type: z.literal("d6_pool"),
    baseDice: z.number().int().min(1).max(10),
    minDice: z.number().int().min(1).max(10),
    maxDice: z.number().int().min(1).max(10),
    archetypeBonus: z.number().int().min(0).max(3),
    traitBonus: z.number().int().min(0).max(3),
    advantageBonus: z.number().int().min(0).max(3),
    disadvantagePenalty: z.number().int().min(0).max(3),
    thresholds: z.object({
      easy: z.number().int().min(2).max(6),
      normal: z.number().int().min(2).max(6),
      hard: z.number().int().min(2).max(6),
    }),
    criticalFailureRequiresOne: z.boolean(),
    offerSuccessWithCost: z.boolean(),
  })
  .superRefine((mechanic, context) => {
    if (mechanic.minDice > mechanic.maxDice) {
      context.addIssue({
        code: "custom",
        path: ["minDice"],
        message: "minDice must not exceed maxDice.",
      });
    }

    if (
      mechanic.baseDice < mechanic.minDice ||
      mechanic.baseDice > mechanic.maxDice
    ) {
      context.addIssue({
        code: "custom",
        path: ["baseDice"],
        message: "baseDice must be within the configured pool limits.",
      });
    }

    const { easy, normal, hard } = mechanic.thresholds;
    if (easy > normal || normal > hard) {
      context.addIssue({
        code: "custom",
        path: ["thresholds"],
        message: "Difficulty thresholds must increase from easy to hard.",
      });
    }
  });

export const rulesetSchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(120),
  version: z.number().int().positive(),
  description: z.string().trim().max(1_000),
  checkMechanic: checkMechanicSchema,
});

export type Ruleset = z.infer<typeof rulesetSchema>;

export const coreAdventureRuleset: Ruleset = {
  id: "core-adventure",
  name: "Abenteuer",
  version: 1,
  description: "Das erzählerische W6-Pool-Grundsystem von DungeonScribe.",
  checkMechanic: {
    type: "d6_pool",
    baseDice: 1,
    minDice: 1,
    maxDice: 3,
    archetypeBonus: 1,
    traitBonus: 1,
    advantageBonus: 1,
    disadvantagePenalty: 1,
    thresholds: {
      easy: 4,
      normal: 5,
      hard: 6,
    },
    criticalFailureRequiresOne: true,
    offerSuccessWithCost: true,
  },
};
