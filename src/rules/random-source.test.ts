import { describe, expect, it } from "vitest";
import {
  CryptoRandomSource,
  RandomSourceError,
} from "@/rules/random-source";
import { FixedRandomSource } from "@/rules/testing/fixed-random-source";

describe("FixedRandomSource", () => {
  it("returns a reproducible sequence", () => {
    const source = new FixedRandomSource([1, 6]);

    expect(source.nextInt(1, 6)).toBe(1);
    expect(source.nextInt(1, 6)).toBe(6);
    expect(source.remaining()).toBe(0);
  });

  it("rejects exhausted and out-of-range sequences", () => {
    const exhausted = new FixedRandomSource([]);
    const invalid = new FixedRandomSource([7]);

    expect(() => exhausted.nextInt(1, 6)).toThrow(RandomSourceError);
    expect(() => invalid.nextInt(1, 6)).toThrow(RandomSourceError);
  });
});

describe("CryptoRandomSource", () => {
  it("returns integers within the inclusive range", () => {
    const source = new CryptoRandomSource();
    const values = Array.from({ length: 100 }, () => source.nextInt(1, 6));

    expect(values.every((value) => Number.isInteger(value))).toBe(true);
    expect(values.every((value) => value >= 1 && value <= 6)).toBe(true);
  });

  it("rejects invalid ranges", () => {
    const source = new CryptoRandomSource();

    expect(() => source.nextInt(2, 1)).toThrow(RandomSourceError);
    expect(() => source.nextInt(1.5, 2)).toThrow(RandomSourceError);
  });
});
