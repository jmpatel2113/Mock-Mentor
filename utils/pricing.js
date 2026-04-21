export const FREE_INTERVIEW_LIMIT = 2;
export const PAID_INTERVIEW_LIMIT = 20;

export const pricingPlans = [
  {
    planKey: "monthly",
    duration: "Monthly",
    price: 4.99,
    quotaLimit: PAID_INTERVIEW_LIMIT,
    description: "20 interview sessions every month.",
  },
  {
    planKey: "yearly",
    duration: "Yearly",
    price: 39.99,
    quotaLimit: PAID_INTERVIEW_LIMIT,
    description: "20 interview sessions every month, billed annually.",
  },
];

export function getStripePriceId(planKey) {
  const priceMap = {
    monthly: process.env.MONTHLY_PRICE_ID,
    yearly: process.env.YEARLY_PRICE_ID,
  };

  return priceMap[planKey];
}

export function getPlanDetails(planKey) {
  return pricingPlans.find((plan) => plan.planKey === planKey) ?? null;
}
