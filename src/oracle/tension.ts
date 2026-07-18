export const campaignTensionMinimum = 1;
export const campaignTensionMaximum = 6;

export const tensionAdjustments = ["decrease", "steady", "increase"] as const;
export type TensionAdjustment = (typeof tensionAdjustments)[number];

const adjustmentValues: Record<TensionAdjustment, number> = {
  decrease: -1,
  steady: 0,
  increase: 1,
};

export interface TensionAdjustmentResult {
  previous: number;
  adjustment: TensionAdjustment;
  change: number;
  next: number;
  wasLimited: boolean;
}

export function isCampaignTension(value: number): boolean {
  return Number.isInteger(value) &&
    value >= campaignTensionMinimum &&
    value <= campaignTensionMaximum;
}

export function adjustTension(
  current: number,
  adjustment: TensionAdjustment,
): TensionAdjustmentResult {
  if (!isCampaignTension(current)) {
    throw new RangeError("Campaign tension must be an integer from 1 to 6.");
  }
  const change = adjustmentValues[adjustment];
  const unlimited = current + change;
  const next = Math.min(
    campaignTensionMaximum,
    Math.max(campaignTensionMinimum, unlimited),
  );
  return { previous: current, adjustment, change, next, wasLimited: next !== unlimited };
}

export function evaluateDoubleEventTrigger(
  dice: readonly [number, number],
  tension: number,
): boolean {
  if (!isCampaignTension(tension)) {
    throw new RangeError("Campaign tension must be an integer from 1 to 6.");
  }
  return dice[0] === dice[1] && dice[0] <= tension;
}
