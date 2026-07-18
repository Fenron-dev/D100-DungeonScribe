import type { RandomSource } from "@/rules/random-source";
import type {
  OracleAnswer,
  OracleLikelihood,
  YesNoOracleResult,
} from "@/oracle/types";

const likelihoodModifiers: Record<OracleLikelihood, number> = {
  nearly_impossible: -4,
  unlikely: -2,
  even: 0,
  likely: 2,
  nearly_certain: 4,
};

function determineAnswer(total: number): OracleAnswer {
  if (total === 2) return "no_and";
  if (total <= 5) return "no";
  if (total === 6) return "no_but";
  if (total === 7) return "uncertain";
  if (total === 8) return "yes_but";
  if (total <= 11) return "yes";
  return "yes_and";
}

export class YesNoOracle {
  public constructor(private readonly randomSource: RandomSource) {}

  public ask(likelihood: OracleLikelihood): YesNoOracleResult {
    const firstDie = this.randomSource.nextInt(1, 6);
    const secondDie = this.randomSource.nextInt(1, 6);
    const rawTotal = firstDie + secondDie;
    const modifier = likelihoodModifiers[likelihood];
    const unboundedTotal = rawTotal + modifier;
    const adjustedTotal = Math.min(12, Math.max(2, unboundedTotal));
    const answer = determineAnswer(adjustedTotal);
    return {
      dice: [firstDie, secondDie],
      rawTotal,
      modifier,
      adjustedTotal,
      answer,
      isDouble: firstDie === secondDie,
      explanation: {
        likelihood,
        rawTotal,
        modifier,
        adjustedTotal,
        wasLimited: adjustedTotal !== unboundedTotal,
        answer,
      },
    };
  }
}
