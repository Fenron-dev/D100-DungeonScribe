import type { PrismaClient } from "@/generated/prisma/client";
import type {
  AppSetting,
  AppSettingRepository,
} from "@/repositories/app-setting-repository";

export class PrismaAppSettingRepository implements AppSettingRepository {
  public constructor(private readonly client: PrismaClient) {}

  public async findValue(key: string): Promise<string | null> {
    const setting = await this.client.appSetting.findUnique({
      where: { key },
      select: { value: true },
    });

    return setting?.value ?? null;
  }

  public async setValue(setting: AppSetting): Promise<void> {
    await this.client.appSetting.upsert({
      where: { key: setting.key },
      create: setting,
      update: { value: setting.value },
    });
  }

  public async deleteValue(key: string): Promise<boolean> {
    const result = await this.client.appSetting.deleteMany({
      where: { key },
    });

    return result.count > 0;
  }
}
