import { prisma } from "@/db/prisma";
import { YesNoOracle } from "@/oracle/yes-no-oracle";
import { InspirationOracle } from "@/oracle/inspiration-oracle";
import { RandomEventOracle } from "@/oracle/random-event-oracle";
import { PrismaOracleRepository } from "@/repositories/prisma/prisma-oracle-repository";
import { CryptoRandomSource } from "@/rules/random-source";
import { OracleService } from "@/services/oracle-service";

export const oracleService = new OracleService(
  new PrismaOracleRepository(prisma),
  new YesNoOracle(new CryptoRandomSource()),
  new InspirationOracle(new CryptoRandomSource()),
  new RandomEventOracle(new CryptoRandomSource()),
);
