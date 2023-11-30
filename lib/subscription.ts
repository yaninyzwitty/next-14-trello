import { auth } from "@clerk/nextjs";
import db from "./db";
const day_in_ms = 86_400_000;
export const checkSubscription = async () => {
    const { orgId } = auth();
    if(!orgId) return false;
    const orgSubscription = await db.orgSubscription.findUnique({
        where: {
            orgId
        },
        select: {
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true
        }
    });

    if(!orgSubscription) return false;
    const isValid = orgSubscription.stripePriceId && orgSubscription.stripeCurrentPeriodEnd?.getTime()! + day_in_ms > Date.now();

    return !!isValid;
}