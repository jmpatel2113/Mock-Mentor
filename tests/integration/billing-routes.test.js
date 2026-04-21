/** @vitest-environment node */
import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.fn();
const currentUserMock = vi.fn();
const getEntitlementSummaryMock = vi.fn();
const getLatestSubscriptionByEmailMock = vi.fn();
const checkoutCreateMock = vi.fn();
const portalCreateMock = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: authMock,
  currentUser: currentUserMock,
}));

vi.mock("@/utils/billing", () => ({
  getEntitlementSummary: getEntitlementSummaryMock,
  getLatestSubscriptionByEmail: getLatestSubscriptionByEmailMock,
}));

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: checkoutCreateMock,
      },
    },
    billingPortal: {
      sessions: {
        create: portalCreateMock,
      },
    },
  })),
}));

describe("billing routes", () => {
  beforeEach(() => {
    vi.resetModules();
    authMock.mockReset();
    currentUserMock.mockReset();
    getEntitlementSummaryMock.mockReset();
    getLatestSubscriptionByEmailMock.mockReset();
    checkoutCreateMock.mockReset();
    portalCreateMock.mockReset();
  });

  it("returns billing status for authenticated users", async () => {
    authMock.mockReturnValue({ userId: "user_123" });
    currentUserMock.mockResolvedValue({ primaryEmailAddress: { emailAddress: "tester@example.com" } });
    getEntitlementSummaryMock.mockResolvedValue({ plan: "free", remainingInterviews: 2 });

    const { GET } = await import("@/app/api/billing/status/route");
    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ plan: "free" });
  });

  it("creates a checkout session for a valid plan", async () => {
    authMock.mockReturnValue({ userId: "user_123" });
    currentUserMock.mockResolvedValue({ primaryEmailAddress: { emailAddress: "tester@example.com" } });
    checkoutCreateMock.mockResolvedValue({ url: "https://stripe.test/checkout" });
    vi.stubEnv("MONTHLY_PRICE_ID", "price_monthly");

    const { POST } = await import("@/app/api/billing/checkout/route");
    const response = await POST(new Request("http://localhost/api/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ planKey: "monthly" }),
      headers: { "Content-Type": "application/json" },
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ url: "https://stripe.test/checkout" });
  });

  it("rejects checkout for an invalid plan", async () => {
    authMock.mockReturnValue({ userId: "user_123" });
    currentUserMock.mockResolvedValue({ primaryEmailAddress: { emailAddress: "tester@example.com" } });

    const { POST } = await import("@/app/api/billing/checkout/route");
    const response = await POST(new Request("http://localhost/api/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ planKey: "weekly" }),
      headers: { "Content-Type": "application/json" },
    }));

    expect(response.status).toBe(400);
  });

  it("creates a billing portal session for subscribed users", async () => {
    authMock.mockReturnValue({ userId: "user_123" });
    currentUserMock.mockResolvedValue({ primaryEmailAddress: { emailAddress: "tester@example.com" } });
    getLatestSubscriptionByEmailMock.mockResolvedValue({ stripeCustomerId: "cus_123" });
    portalCreateMock.mockResolvedValue({ url: "https://stripe.test/portal" });

    const { POST } = await import("@/app/api/billing/portal/route");
    const response = await POST(new Request("http://localhost/api/billing/portal", { method: "POST" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ url: "https://stripe.test/portal" });
  });

  it("rejects billing portal for missing billing account", async () => {
    authMock.mockReturnValue({ userId: "user_123" });
    currentUserMock.mockResolvedValue({ primaryEmailAddress: { emailAddress: "tester@example.com" } });
    getLatestSubscriptionByEmailMock.mockResolvedValue(null);

    const { POST } = await import("@/app/api/billing/portal/route");
    const response = await POST(new Request("http://localhost/api/billing/portal", { method: "POST" }));

    expect(response.status).toBe(404);
  });
});
