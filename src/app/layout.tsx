import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MainNavigation } from "@/components/main-navigation";
import { getMessages } from "@/i18n/messages";
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

export default function RootLayout({ children }: RootLayoutProps) {
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
