import { describe, expect, it } from "vitest";
import type {
  OracleRecord,
  YesNoOracleInput,
  YesNoOracleResult,
} from "@/oracle/types";
import { YesNoOracle } from "@/oracle/yes-no-oracle";
import type { OracleRepository } from "@/repositories/oracle-repository";
import { FixedRandomSource } from "@/rules/testing/fixed-random-source";
import { OracleContextNotFoundError, OracleService } from "@/services/oracle-service";

class InMemoryOracleRepository implements OracleRepository {
  public saved: OracleRecord | null = null;
  public constructor(private readonly available = true) {}
  public async create(
    campaignId: string,
    sceneId: string,
    input: YesNoOracleInput,
    result: YesNoOracleResult,
  ): Promise<OracleRecord | null> {
    if (!this.available) return null;
    this.saved = {
      id: "oracle-1",
      campaignId,
      sceneId,
      ...input,
      ...result,
      createdAt: new Date("2026-07-18T15:00:00Z"),
    };
    return this.saved;
  }
}

describe("OracleService", () => {
  it("evaluates and stores a yes-no question", async () => {
    const repository = new InMemoryOracleRepository();
    const service = new OracleService(
      repository,
      new YesNoOracle(new FixedRandomSource([4, 5])),
    );
    const record = await service.askYesNo("campaign-1", "scene-1", {
      question: "Ist die Tür verschlossen?",
      likelihood: "likely",
    });
    expect(record).toMatchObject({
      dice: [4, 5],
      rawTotal: 9,
      modifier: 2,
      adjustedTotal: 11,
      answer: "yes",
    });
    expect(repository.saved?.question).toBe("Ist die Tür verschlossen?");
  });

  it("does not return a result outside an active scene", async () => {
    const service = new OracleService(
      new InMemoryOracleRepository(false),
      new YesNoOracle(new FixedRandomSource([3, 4])),
    );
    await expect(
      service.askYesNo("campaign-1", "scene-1", {
        question: "Ist jemand hier?",
        likelihood: "even",
      }),
    ).rejects.toBeInstanceOf(OracleContextNotFoundError);
  });
});
