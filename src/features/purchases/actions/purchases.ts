"use server";

import { stripeServerClient } from "@/services/stripe/stripeServer";
import { canRefundPurchases } from "../permissions/products";
import { getCurrentUser } from "@/services/clerk";
import { db } from "@/drizzle/db";
import { updatePurchase } from "../db/purchases";

import { eq } from "drizzle-orm";
import { PurchaseTable } from "@/drizzle/schema";
import { revokeUserCourseAccess } from "@/features/courses/db/userCourseAccess";

export async function refundPurchase(id: string) {
  const user = await getCurrentUser();

  if (!canRefundPurchases(user)) {
    return {
      error: true,
      message: "Unauthorized to refund this purchase",
    };
  }

  // Step 1: Get purchase details
  const purchase = await db.query.PurchaseTable.findFirst({
    where: eq(PurchaseTable.id, id),
  });

  if (!purchase || purchase.refundedAt !== null) {
    return {
      error: true,
      message: "Purchase not found or already refunded",
    };
  }

  // Step 2: Retrieve Stripe session
  const session = await stripeServerClient.checkout.sessions.retrieve(
    purchase.stripeSessionId
  );

  if (!session.payment_intent) {
    return {
      error: true,
      message: "Missing payment intent on Stripe session",
    };
  }

  // Step 3: Issue refund
  try {
    await stripeServerClient.refunds.create({
      payment_intent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent.id,
    });
  } catch {
    return {
      error: true,
      message: "Stripe refund failed",
    };
  }

  // Step 4: Mark as refunded
  await updatePurchase(id, { refundedAt: new Date() });

  // Step 5: Revoke course access
  await revokeUserCourseAccess(purchase);

  return {
    error: false,
    message: "Successfully refunded purchase",
  };
}
