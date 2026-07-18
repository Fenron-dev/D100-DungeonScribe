import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SceneTabs } from "@/features/scenes/scene-tabs";

describe("SceneTabs", () => {
  it("switches panels with buttons and arrow keys", () => {
    render(
      <SceneTabs
        ariaLabel="Spielbereiche"
        tabs={[
          { id: "master", label: "Spielleiter", content: <p>Antwort</p> },
          { id: "journal", label: "Journal", content: <p>Verlauf</p> },
        ]}
      />,
    );
    const master = screen.getByRole("tab", { name: "Spielleiter" });
    const journal = screen.getByRole("tab", { name: "Journal" });
    expect(master).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(master, { key: "ArrowRight" });
    expect(journal).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Verlauf")).toBeVisible();
  });
});
