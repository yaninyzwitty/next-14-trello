import Stripe from "stripe";
import { headers  } from "next/headers";
import { NextResponse } from "next/server";
import { stripe  } from "@/lib/stripe";
import db from "@/lib/db";

export async function POST(request: Request) {
    const body = await request.text();
    const signature = headers().get('stripe-signature') as string;

    let event:Stripe.Event;
    try {
        event =  stripe.webhooks.constructEvent(
            body, signature, process.env.STRIPE_WEBHOOK_SECRET!
        )
        
    } catch (error) {
        return new NextResponse('Webhook errror', { status: 400 })
        
    }
    const session = event.data.object as Stripe.Checkout.Session;
    if(event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        if(!session?.metadata?.orgId) {
            return new NextResponse('oRG ID rEQUIRED', { status: 400 })
        };

        await db.orgSubscription.create({
            data: {
                orgId: session?.metadata?.orgId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            }
        });
    
    }
if(event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    await db.orgSubscription.update({
        where: {
            stripeSubscriptionId: subscription.id,
        },
        data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        }
    })
    
}


return new NextResponse(null, { status: 200 })
}