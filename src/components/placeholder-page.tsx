import Link from "next/link";
import { getMessages } from "@/i18n/messages";

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  const messages = getMessages();

  return (
    <section className="placeholder-panel" aria-labelledby="placeholder-title">
      <p className="eyebrow">D100 DungeonScribe</p>
      <h1 id="placeholder-title">{title}</h1>
      <p>{messages.placeholders.description}</p>
      <Link className="button button-secondary" href="/">
        {messages.placeholders.backHome}
      </Link>
    </section>
  );
}
