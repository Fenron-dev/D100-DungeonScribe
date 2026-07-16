export interface AppSetting {
  key: string;
  value: string;
}

export interface AppSettingRepository {
  findValue(key: string): Promise<string | null>;
  setValue(setting: AppSetting): Promise<void>;
  deleteValue(key: string): Promise<boolean>;
}
