/** @vitest-environment node */
import { beforeEach, describe, expect, it, vi } from "vitest";

const constructEventMock = vi.fn();
const retrieveSubscriptionMock = vi.fn();
const retrieveCustomerMock = vi.fn();
const getSubscriptionByCustomerIdMock = vi.fn();
const getSubscriptionByStripeIdMock = vi.fn();
const upsertSubscriptionRecordMock = vi.fn();

vi.mock("@/utils/billing", () => ({
  getSubscriptionByCustomerId: getSubscriptionByCustomerIdMock,
  getSubscriptionByStripeId: getSubscriptionByStripeIdMock,
  upsertSubscriptionRecord: upsertSubscriptionRecordMock,
}));

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: constructEventMock,
    },
    subscriptions: {
      retrieve: retrieveSubscriptionMock,
    },
    customers: {
      retrieve: retrieveCustomerMock,
    },
  })),
}));

describe("POST /api/stripe", () => {
  beforeEach(() => {
    vi.resetModules();
    constructEventMock.mockReset();
    retrieveSubscriptionMock.mockReset();
    retrieveCustomerMock.mockReset();
    getSubscriptionByCustomerIdMock.mockReset();
    getSubscriptionByStripeIdMock.mockReset();
    upsertSubscriptionRecordMock.mockReset();
  });

  it("syncs checkout.session.completed subscriptions", async () => {
    constructEventMock.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          subscription: "sub_123",
          customer_email: "tester@example.com",
          metadata: {},
        },
      },
    });

    retrieveSubscriptionMock.mockResolvedValue({
      id: "sub_123",
      customer: "cus_123",
      status: "active",
      metadata: { planKey: "monthly" },
      current_period_start: 1_713_926_400,
      current_period_end: 1_716_518_400,
      items: {
        data: [
          {
            price: {
              id: "price_monthly",
              recurring: { interval: "month" },
            },
          },
        ],
      },
    });

    const { POST } = await import("@/app/(api)/stripe/route");
    const response = await POST(new Request("http://localhost/api/stripe", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "payload",
    }));

    expect(response.status).toBe(200);
    expect(upsertSubscriptionRecordMock).toHaveBeenCalledWith(expect.objectContaining({
      customerEmail: "tester@example.com",
      stripeSubscriptionId: "sub_123",
      billingInterval: "monthly",
      quotaLimit: 20,
    }));
  });
});
