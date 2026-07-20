import { describe, expect, it } from "vitest";
import { getCampaignEventCategory } from "@/domain/campaign-event";

describe("getCampaignEventCategory", () => {
  it("keeps inventory changes in the character chronicle category", () => {
    expect(getCampaignEventCategory("INVENTORY_ITEM_ADDED")).toBe("characters");
    expect(getCampaignEventCategory("INVENTORY_ITEM_UPDATED")).toBe("characters");
    expect(getCampaignEventCategory("INVENTORY_ITEM_REMOVED")).toBe("characters");
  });
});
