export interface RandomSource {
  nextInt(min: number, max: number): number;
}

export class RandomSourceError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "RandomSourceError";
  }
}

export class CryptoRandomSource implements RandomSource {
  public nextInt(min: number, max: number): number {
    if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max) {
      throw new RandomSourceError("Random range must contain safe integers.");
    }

    const range = max - min + 1;
    const uint32Range = 0x1_0000_0000;
    if (range > uint32Range) {
      throw new RandomSourceError("Random range exceeds 32-bit capacity.");
    }

    const upperBound = Math.floor(uint32Range / range) * range;
    const buffer = new Uint32Array(1);
    let value: number;

    do {
      crypto.getRandomValues(buffer);
      const candidate = buffer[0];
      if (candidate === undefined) {
        throw new RandomSourceError("Crypto random source returned no value.");
      }
      value = candidate;
    } while (value >= upperBound);

    return min + (value % range);
  }
}
