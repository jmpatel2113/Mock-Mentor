export function createFreeStatus(overrides = {}) {
  return {
    plan: "free",
    status: "free",
    isSubscribed: false,
    billingInterval: null,
    quotaLimit: 2,
    usedInterviews: 0,
    remainingInterviews: 2,
    resetOn: null,
    canCreate: true,
    canManageBilling: false,
    ...overrides,
  };
}

export function createPaidStatus(overrides = {}) {
  return {
    plan: "monthly",
    status: "active",
    isSubscribed: true,
    billingInterval: "monthly",
    quotaLimit: 20,
    usedInterviews: 4,
    remainingInterviews: 16,
    resetOn: "2026-05-01T00:00:00.000Z",
    canCreate: true,
    canManageBilling: true,
    ...overrides,
  };
}

export function createSubscription(overrides = {}) {
  return {
    status: "active",
    billingInterval: "monthly",
    quotaLimit: 20,
    currentPeriodStart: "2026-04-01T00:00:00.000Z",
    currentPeriodEnd: "2026-05-01T00:00:00.000Z",
    stripeCustomerId: "cus_123",
    ...overrides,
  };
}

export function createInterview(overrides = {}) {
  return {
    id: 1,
    createdBy: "tester@example.com",
    createdOn: "2026-04-10T00:00:00.000Z",
    ...overrides,
  };
}
