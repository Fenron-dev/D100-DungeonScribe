import type { RandomSource } from "@/rules/random-source";
import {
  eventFocuses,
  randomEventActionIds,
  randomEventSubjectIds,
  type RandomEventResult,
} from "@/oracle/types";

export class RandomEventOracle {
  public constructor(private readonly randomSource: RandomSource) {}

  public generate(): RandomEventResult {
    const focusIndex = this.randomSource.nextInt(0, eventFocuses.length - 1);
    const actionIndex = this.randomSource.nextInt(0, randomEventActionIds.length - 1);
    const subjectIndex = this.randomSource.nextInt(0, randomEventSubjectIds.length - 1);
    const focus = eventFocuses[focusIndex];
    const actionId = randomEventActionIds[actionIndex];
    const subjectId = randomEventSubjectIds[subjectIndex];
    if (!focus || !actionId || !subjectId) {
      throw new Error("Random event table selection is invalid.");
    }
    return {
      focus,
      actionId,
      subjectId,
      affectedEntityId: null,
      explanation: {
        focusIndex,
        focusTableSize: eventFocuses.length,
        actionIndex,
        actionTableSize: randomEventActionIds.length,
        subjectIndex,
        subjectTableSize: randomEventSubjectIds.length,
      },
    };
  }
}
