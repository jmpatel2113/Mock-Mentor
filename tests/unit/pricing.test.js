import { describe, expect, it, vi } from "vitest";

describe("pricing helpers", () => {
  it("returns plan details for known plans", async () => {
    const { getPlanDetails } = await import("@/utils/pricing");

    expect(getPlanDetails("monthly")).toMatchObject({
      planKey: "monthly",
      quotaLimit: 20,
    });
    expect(getPlanDetails("yearly")).toMatchObject({
      planKey: "yearly",
      quotaLimit: 20,
    });
  });

  it("returns null for unknown plans", async () => {
    const { getPlanDetails } = await import("@/utils/pricing");
    expect(getPlanDetails("weekly")).toBeNull();
  });

  it("resolves stripe price ids from env", async () => {
    vi.stubEnv("MONTHLY_PRICE_ID", "price_monthly");
    vi.stubEnv("YEARLY_PRICE_ID", "price_yearly");
    const { getStripePriceId } = await import("@/utils/pricing");

    expect(getStripePriceId("monthly")).toBe("price_monthly");
    expect(getStripePriceId("yearly")).toBe("price_yearly");
  });
});
