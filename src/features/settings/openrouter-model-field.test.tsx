import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OpenRouterModelField } from "@/features/settings/openrouter-model-field";
import { getMessages } from "@/i18n/messages";

const models = [
  { id: "openrouter/free", name: "Free Models Router", free: true },
  { id: "example/story:free", name: "Free Story", free: true },
  { id: "example/story-pro", name: "Story Pro", free: false },
];

describe("OpenRouterModelField", () => {
  it("renders the loaded free models as a visible selection", () => {
    render(
      <OpenRouterModelField
        catalogAvailable
        copy={getMessages().aiSettings}
        defaultValue="openrouter/free"
        id="model"
        models={models}
      />,
    );

    const selection = screen.getByRole("combobox");
    expect(selection).toHaveValue("openrouter/free");
    expect(screen.getByRole("option", { name: /Free Story/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Story Pro/ })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("option", { name: /Story Pro/ })).toBeInTheDocument();
  });
});
