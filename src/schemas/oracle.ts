import { z } from "zod";
import { oracleAnswers, oracleLikelihoods } from "@/oracle/types";

export const yesNoOracleInputSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Bitte gib eine Ja-Nein-Frage ein.")
    .max(500, "Die Frage darf höchstens 500 Zeichen enthalten."),
  likelihood: z.enum(oracleLikelihoods),
});

export const oracleLikelihoodSchema = z.enum(oracleLikelihoods);
export const oracleAnswerSchema = z.enum(oracleAnswers);
