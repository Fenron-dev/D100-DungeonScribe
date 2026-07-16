import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the German welcome content", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Willkommen bei D100 DungeonScribe",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Neue Kampagne" }),
    ).toHaveAttribute("href", "/campaigns/new");
  });
});
