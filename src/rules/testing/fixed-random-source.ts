import {
  RandomSourceError,
  type RandomSource,
} from "@/rules/random-source";

export class FixedRandomSource implements RandomSource {
  private index = 0;

  public constructor(private readonly values: readonly number[]) {}

  public nextInt(min: number, max: number): number {
    const value = this.values[this.index];
    if (value === undefined) {
      throw new RandomSourceError("Fixed random sequence is exhausted.");
    }
    this.index += 1;

    if (!Number.isInteger(value) || value < min || value > max) {
      throw new RandomSourceError(
        `Fixed random value ${value} is outside ${min}...${max}.`,
      );
    }

    return value;
  }

  public remaining(): number {
    return this.values.length - this.index;
  }
}
