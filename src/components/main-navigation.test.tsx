import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getMessages } from "@/i18n/messages";
import { MainNavigation } from "./main-navigation";

describe("MainNavigation", () => {
  it("contains all four primary destinations", () => {
    render(<MainNavigation messages={getMessages()} />);

    expect(screen.getByRole("link", { name: "Spielen" })).toHaveAttribute(
      "href",
      "/play",
    );
    expect(screen.getByRole("link", { name: "Kampagnen" })).toHaveAttribute(
      "href",
      "/campaigns",
    );
    expect(screen.getByRole("link", { name: "Bibliothek" })).toHaveAttribute(
      "href",
      "/library",
    );
    expect(
      screen.getByRole("link", { name: "Einstellungen" }),
    ).toHaveAttribute("href", "/settings");
  });
});
