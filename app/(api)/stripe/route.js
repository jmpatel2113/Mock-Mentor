import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPlanDetails } from '../../../utils/pricing';
import { getSubscriptionByCustomerId, getSubscriptionByStripeId, upsertSubscriptionRecord } from '../../../utils/billing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
export const runtime = "nodejs";

export async function POST(request) {
    if (!webhookSecret && process.env.NODE_ENV === "production") {
        return new NextResponse("Webhook secret is not configured.", { status: 500 });
    }

    const buf = Buffer.from(await request.arrayBuffer());
    const sig = request.headers.get('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret ?? "test_webhook_secret");
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            await handleCheckoutSession(session);
            break;
        }
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
            const subscription = event.data.object;
            await syncSubscriptionRecord(subscription);
            break;
        }
        default:
            console.warn(`Unhandled Stripe event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

async function handleCheckoutSession(session) {
    if (!session.subscription) {
        return;
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription, {
        expand: ['items.data.price'],
    });

    await syncSubscriptionRecord(subscription, session.customer_email ?? session.metadata?.userEmail ?? null);
}

async function syncSubscriptionRecord(subscription, fallbackEmail = null) {
    const planKey = subscription.metadata?.planKey;
    const planDetails = getPlanDetails(planKey);
    const price = subscription.items?.data?.[0]?.price;
    const priceId = price?.id ?? null;
    const billingInterval = normalizeBillingInterval(price?.recurring?.interval ?? planKey ?? "monthly");
    const quotaLimit = planDetails?.quotaLimit ?? 20;
    const customerEmail = fallbackEmail
        ?? await resolveCustomerEmail(subscription.customer)
        ?? (await getExistingCustomerEmail(subscription.customer, subscription.id));
    const timestamp = new Date().toISOString();

    if (!customerEmail) {
        console.warn(`Unable to resolve customer email for subscription ${subscription.id}`);
        return;
    }

    await upsertSubscriptionRecord({
        customerEmail,
        stripeCustomerId: `${subscription.customer}`,
        stripeSubscriptionId: subscription.id,
        priceId,
        status: subscription.status,
        billingInterval,
        quotaLimit,
        currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        createdAt: timestamp,
        updatedAt: timestamp,
    });
}

async function resolveCustomerEmail(customerId) {
    if (!customerId) return null;

    const customer = await stripe.customers.retrieve(`${customerId}`);
    if (customer.deleted) {
        return null;
    }

    return customer.email ?? null;
}

async function getExistingCustomerEmail(customerId, subscriptionId) {
    const existingByCustomer = await getSubscriptionByCustomerId(`${customerId}`);
    if (existingByCustomer?.customerEmail) {
        return existingByCustomer.customerEmail;
    }

    const existingBySubscription = await getSubscriptionByStripeId(subscriptionId);
    return existingBySubscription?.customerEmail ?? null;
}

function normalizeBillingInterval(interval) {
    if (interval === "month" || interval === "monthly") {
        return "monthly";
    }

    if (interval === "year" || interval === "yearly") {
        return "yearly";
    }

    return "monthly";
}
