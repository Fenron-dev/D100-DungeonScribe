import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MainNavigation } from "@/components/main-navigation";
import { AppLock } from "@/features/settings/app-lock";
import { getMessages } from "@/i18n/messages";
import {
  hasEncryptedProfileVault,
  isAiProfileVaultUnlocked,
} from "@/services/ai-profile-vault-service";
import "./globals.css";

const messages = getMessages();

export const metadata: Metadata = {
  title: {
    default: messages.appName,
    template: `%s · ${messages.appName}`,
  },
  description: messages.home.description,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const [configured, unlocked] = await Promise.all([
    hasEncryptedProfileVault(),
    isAiProfileVaultUnlocked(),
  ]);

  if (!unlocked) {
    return (
      <html lang="de">
        <body><AppLock configured={configured} copy={messages.aiSettings} /></body>
      </html>
    );
  }
  return (
    <html lang="de">
      <body>
        <a className="skip-link" href="#main-content">
          {messages.skipToContent}
        </a>
        <div className="app-shell">
          <MainNavigation messages={messages} />
          <main id="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
