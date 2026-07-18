import { z } from "zod";
import { difficulties } from "@/rules/types";

export const difficultySchema = z.enum(difficulties);
