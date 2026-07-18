import type { OracleRecord } from "@/oracle/types";
import type { YesNoOracle } from "@/oracle/yes-no-oracle";
import type { OracleRepository } from "@/repositories/oracle-repository";
import { campaignIdSchema } from "@/schemas/campaign";
import { yesNoOracleInputSchema } from "@/schemas/oracle";
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
    private readonly oracle: Pick<YesNoOracle, "ask">,
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
      this.oracle.ask(validInput.likelihood),
    );
    if (!record) throw new OracleContextNotFoundError();
    return record;
  }
}
