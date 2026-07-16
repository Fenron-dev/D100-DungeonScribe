import Link from "next/link";
import type { getMessages } from "@/i18n/messages";

type Messages = ReturnType<typeof getMessages>;

interface MainNavigationProps {
  messages: Messages;
}

const navigationItems = [
  { href: "/play", label: "play" },
  { href: "/campaigns", label: "campaigns" },
  { href: "/library", label: "library" },
  { href: "/settings", label: "settings" },
] as const;

export function MainNavigation({ messages }: MainNavigationProps) {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label={messages.appName}>
        <span className="brand-mark" aria-hidden="true">
          D100
        </span>
        <span>{messages.appName}</span>
      </Link>
      <nav aria-label={messages.navigationLabel}>
        <ul className="navigation-list">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{messages.navigation[item.label]}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
