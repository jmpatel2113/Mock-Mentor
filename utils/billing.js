import { desc, eq } from "drizzle-orm";
import db from "./db";
import { MockInterview, SubscriptionData } from "./schema";
import { FREE_INTERVIEW_LIMIT, PAID_INTERVIEW_LIMIT } from "./pricing";

const INACTIVE_STATUSES = new Set(["unpaid", "incomplete", "incomplete_expired"]);

export function parseStoredDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;

  const normalizedValue = `${value}`.trim();
  const isoDate = new Date(normalizedValue);
  if (!Number.isNaN(isoDate.getTime())) {
    return isoDate;
  }

  const [day, month, year] = normalizedValue.split("-");
  if (day && month && year) {
    const legacyDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    if (!Number.isNaN(legacyDate.getTime())) {
      return legacyDate;
    }
  }

  return null;
}

function addMonths(date, monthCount) {
  const nextDate = new Date(date);
  nextDate.setUTCMonth(nextDate.getUTCMonth() + monthCount);
  return nextDate;
}

export function hasSubscriptionAccess(subscription, referenceDate = new Date()) {
  if (!subscription?.status) return false;

  const currentPeriodEnd = parseStoredDate(subscription.currentPeriodEnd);
  if (!currentPeriodEnd || currentPeriodEnd < referenceDate) {
    return false;
  }

  return !INACTIVE_STATUSES.has(subscription.status);
}

export function getEntitlementWindow(subscription, referenceDate = new Date()) {
  if (!subscription) return null;

  const periodStart = parseStoredDate(subscription.currentPeriodStart);
  const periodEnd = parseStoredDate(subscription.currentPeriodEnd);

  if (!periodStart || !periodEnd) return null;

  if (subscription.billingInterval === "monthly") {
    return {
      start: periodStart,
      end: periodEnd,
    };
  }

  let windowStart = new Date(periodStart);
  let windowEnd = addMonths(windowStart, 1);

  while (windowEnd <= referenceDate && windowEnd < periodEnd) {
    windowStart = new Date(windowEnd);
    windowEnd = addMonths(windowStart, 1);
  }

  if (windowEnd > periodEnd) {
    windowEnd = new Date(periodEnd);
  }

  return {
    start: windowStart,
    end: windowEnd,
  };
}

export async function getLatestSubscriptionByEmail(email) {
  if (!email) return null;

  const subscriptions = await db.select()
    .from(SubscriptionData)
    .where(eq(SubscriptionData.customerEmail, email))
    .orderBy(desc(SubscriptionData.subscriptionId));

  return subscriptions.find((subscription) => hasSubscriptionAccess(subscription))
    ?? subscriptions[0]
    ?? null;
}

export async function getSubscriptionByStripeId(stripeSubscriptionId) {
  if (!stripeSubscriptionId) return null;

  const subscriptions = await db.select()
    .from(SubscriptionData)
    .where(eq(SubscriptionData.stripeSubscriptionId, stripeSubscriptionId))
    .orderBy(desc(SubscriptionData.subscriptionId));

  return subscriptions[0] ?? null;
}

export async function getSubscriptionByCustomerId(stripeCustomerId) {
  if (!stripeCustomerId) return null;

  const subscriptions = await db.select()
    .from(SubscriptionData)
    .where(eq(SubscriptionData.stripeCustomerId, stripeCustomerId))
    .orderBy(desc(SubscriptionData.subscriptionId));

  return subscriptions[0] ?? null;
}

async function countInterviewsForWindow(email, windowStart, windowEnd) {
  const interviews = await db.select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, email))
    .orderBy(desc(MockInterview.id));

  if (!windowStart || !windowEnd) {
    return interviews.length;
  }

  return interviews.filter((interview) => {
    const createdAt = parseStoredDate(interview.createdOn);
    return createdAt && createdAt >= windowStart && createdAt < windowEnd;
  }).length;
}

export async function getEntitlementSummary(email) {
  const subscription = await getLatestSubscriptionByEmail(email);
  const hasPaidAccess = hasSubscriptionAccess(subscription);

  if (!hasPaidAccess) {
    const usedInterviews = await countInterviewsForWindow(email);
    const remainingInterviews = Math.max(FREE_INTERVIEW_LIMIT - usedInterviews, 0);

    return {
      plan: "free",
      status: "free",
      isSubscribed: false,
      billingInterval: null,
      quotaLimit: FREE_INTERVIEW_LIMIT,
      usedInterviews,
      remainingInterviews,
      resetOn: null,
      canCreate: remainingInterviews > 0,
      canManageBilling: false,
      subscription,
    };
  }

  const entitlementWindow = getEntitlementWindow(subscription);
  const usedInterviews = await countInterviewsForWindow(email, entitlementWindow?.start, entitlementWindow?.end);
  const quotaLimit = subscription.quotaLimit || PAID_INTERVIEW_LIMIT;
  const remainingInterviews = Math.max(quotaLimit - usedInterviews, 0);

  return {
    plan: subscription.billingInterval,
    status: subscription.status,
    isSubscribed: true,
    billingInterval: subscription.billingInterval,
    quotaLimit,
    usedInterviews,
    remainingInterviews,
    resetOn: entitlementWindow?.end?.toISOString() ?? subscription.currentPeriodEnd,
    currentPeriodStart: subscription.currentPeriodStart,
    currentPeriodEnd: subscription.currentPeriodEnd,
    canCreate: remainingInterviews > 0,
    canManageBilling: Boolean(subscription.stripeCustomerId),
    subscription,
  };
}

export async function upsertSubscriptionRecord(values) {
  const existingSubscription = values.stripeSubscriptionId
    ? await getSubscriptionByStripeId(values.stripeSubscriptionId)
    : (values.stripeCustomerId ? await getSubscriptionByCustomerId(values.stripeCustomerId) : null);

  if (existingSubscription) {
    await db.update(SubscriptionData)
      .set({
        customerEmail: values.customerEmail ?? existingSubscription.customerEmail,
        stripeCustomerId: values.stripeCustomerId ?? existingSubscription.stripeCustomerId,
        stripeSubscriptionId: values.stripeSubscriptionId ?? existingSubscription.stripeSubscriptionId,
        priceId: values.priceId ?? existingSubscription.priceId,
        status: values.status,
        billingInterval: values.billingInterval,
        quotaLimit: values.quotaLimit,
        currentPeriodStart: values.currentPeriodStart,
        currentPeriodEnd: values.currentPeriodEnd,
        updatedAt: values.updatedAt,
      })
      .where(eq(SubscriptionData.subscriptionId, existingSubscription.subscriptionId));

    return {
      ...existingSubscription,
      ...values,
    };
  }

  const inserted = await db.insert(SubscriptionData)
    .values(values)
    .returning();

  return inserted[0];
}
