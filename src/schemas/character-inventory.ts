import { z } from "zod";
import { worldEntityIdSchema } from "@/schemas/world-entity";

export const characterInventoryDraftSchema = z.object({
  itemId: worldEntityIdSchema,
  quantity: z.coerce.number().int().min(1).max(999),
  equipped: z.boolean(),
  notes: z.string().trim().max(1_000),
});

export const characterInventoryUpdateSchema = characterInventoryDraftSchema.omit({
  itemId: true,
});

export const characterInventoryEntryIdSchema = z.string().trim().min(1).max(100);
