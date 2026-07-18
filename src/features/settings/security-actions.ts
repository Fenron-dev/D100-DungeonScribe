"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createEncryptedProfileVault,
  lockAiProfileVault,
  resetEncryptedProfileVault,
  unlockAiProfileVault,
} from "@/services/ai-profile-vault-service";

export interface LockFormState { error: boolean }
export const initialLockFormState: LockFormState = { error: false };

function password(formData: FormData): string {
  const value = formData.get("password");
  return typeof value === "string" ? value : "";
}

export async function setupAppPasswordAction(
  _state: LockFormState,
  formData: FormData,
): Promise<LockFormState> {
  const selectedPassword = password(formData);
  const confirmation = formData.get("passwordConfirmation");
  if (typeof confirmation !== "string" || confirmation !== selectedPassword) {
    return { error: true };
  }
  try {
    await createEncryptedProfileVault(selectedPassword);
  } catch {
    return { error: true };
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function unlockAppAction(
  _state: LockFormState,
  formData: FormData,
): Promise<LockFormState> {
  try {
    await unlockAiProfileVault(password(formData));
  } catch {
    return { error: true };
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function lockAppAction(): Promise<void> {
  await lockAiProfileVault();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetAppPasswordAction(): Promise<void> {
  await resetEncryptedProfileVault();
  revalidatePath("/", "layout");
  redirect("/");
}
