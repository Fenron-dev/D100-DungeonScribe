import { z } from "zod";

export const libraryWorldEntityIdSchema = z
  .string()
  .trim()
  .min(1, "Bibliotheks-ID fehlt.")
  .max(64, "Bibliotheks-ID ist ungültig.");
