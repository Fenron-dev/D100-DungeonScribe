import type { OracleInspiration, OracleRecord } from "@/oracle/types";
import type { InspirationOracle } from "@/oracle/inspiration-oracle";
import type { YesNoOracle } from "@/oracle/yes-no-oracle";
import type { OracleRepository } from "@/repositories/oracle-repository";
import { campaignIdSchema } from "@/schemas/campaign";
import { inspirationInputSchema, yesNoOracleInputSchema } from "@/schemas/oracle";
import { sceneIdSchema } from "@/schemas/scene";

export class OracleContextNotFoundError extends Error {
  public constructor() {
    super("Active scene or campaign not found.");
    this.name = "OracleContextNotFoundError";
  }
}

export class OracleService {
  public constructor(
    private readonly repository: OracleRepository,
    private readonly yesNoOracle: Pick<YesNoOracle, "ask">,
    private readonly inspirationOracle: Pick<InspirationOracle, "draw">,
  ) {}

  public async askYesNo(
    campaignId: string,
    sceneId: string,
    input: unknown,
  ): Promise<OracleRecord> {
    const validInput = yesNoOracleInputSchema.parse(input);
    const record = await this.repository.create(
      campaignIdSchema.parse(campaignId),
      sceneIdSchema.parse(sceneId),
      validInput,
      this.yesNoOracle.ask(validInput.likelihood),
    );
    if (!record) throw new OracleContextNotFoundError();
    return record;
  }

  public async drawInspiration(
    campaignId: string,
    sceneId: string,
    input: unknown,
  ): Promise<OracleInspiration> {
    const validInput = inspirationInputSchema.parse(input);
    const record = await this.repository.createInspiration(
      campaignIdSchema.parse(campaignId),
      sceneIdSchema.parse(sceneId),
      validInput,
      this.inspirationOracle.draw(
        validInput.primaryCategory,
        validInput.secondaryCategory,
      ),
    );
    if (!record) throw new OracleContextNotFoundError();
    return record;
  }
}
