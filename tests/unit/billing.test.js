import { beforeEach, describe, expect, it, vi } from "vitest";
import { createInterview, createSubscription } from "../helpers/mockData";

const selectMock = vi.fn();

vi.mock("@/utils/db", () => ({
  default: {
    select: selectMock,
  },
}));

function createSelectChain(returnValue) {
  return {
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue(returnValue),
      }),
    }),
  };
}

describe("billing helpers", () => {
  beforeEach(() => {
    selectMock.mockReset();
  });

  it("parses ISO and legacy dates", async () => {
    const { parseStoredDate } = await import("@/utils/billing");

    expect(parseStoredDate("2026-04-19T00:00:00.000Z")?.toISOString()).toBe("2026-04-19T00:00:00.000Z");
    expect(parseStoredDate("19-04-2026")?.toISOString()).toBe("2026-04-19T00:00:00.000Z");
  });

  it("checks subscription access from status and period end", async () => {
    const { hasSubscriptionAccess } = await import("@/utils/billing");

    expect(hasSubscriptionAccess(createSubscription(), new Date("2026-04-15T00:00:00.000Z"))).toBe(true);
    expect(hasSubscriptionAccess(createSubscription({ status: "unpaid" }), new Date("2026-04-15T00:00:00.000Z"))).toBe(false);
    expect(hasSubscriptionAccess(createSubscription({ currentPeriodEnd: "2026-03-01T00:00:00.000Z" }), new Date("2026-04-15T00:00:00.000Z"))).toBe(false);
  });

  it("calculates a monthly entitlement window for yearly subscriptions", async () => {
    const { getEntitlementWindow } = await import("@/utils/billing");

    const window = getEntitlementWindow(
      createSubscription({
        billingInterval: "yearly",
        currentPeriodStart: "2026-01-01T00:00:00.000Z",
        currentPeriodEnd: "2027-01-01T00:00:00.000Z",
      }),
      new Date("2026-04-15T00:00:00.000Z")
    );

    expect(window.start.toISOString()).toBe("2026-04-01T00:00:00.000Z");
    expect(window.end.toISOString()).toBe("2026-05-01T00:00:00.000Z");
  });

  it("returns free-tier entitlement when no active subscription exists", async () => {
    selectMock
      .mockReturnValueOnce(createSelectChain([]))
      .mockReturnValueOnce(createSelectChain([createInterview(), createInterview({ id: 2 })]));

    const { getEntitlementSummary } = await import("@/utils/billing");
    const summary = await getEntitlementSummary("tester@example.com");

    expect(summary.plan).toBe("free");
    expect(summary.usedInterviews).toBe(2);
    expect(summary.remainingInterviews).toBe(0);
    expect(summary.canCreate).toBe(false);
  });

  it("returns paid entitlement within the active window", async () => {
    selectMock
      .mockReturnValueOnce(createSelectChain([createSubscription()]))
      .mockReturnValueOnce(createSelectChain([
        createInterview({ createdOn: "2026-04-10T00:00:00.000Z" }),
        createInterview({ id: 2, createdOn: "2026-04-15T00:00:00.000Z" }),
      ]));

    const { getEntitlementSummary } = await import("@/utils/billing");
    const summary = await getEntitlementSummary("tester@example.com");

    expect(summary.plan).toBe("monthly");
    expect(summary.quotaLimit).toBe(20);
    expect(summary.usedInterviews).toBe(2);
    expect(summary.remainingInterviews).toBe(18);
  });
});
