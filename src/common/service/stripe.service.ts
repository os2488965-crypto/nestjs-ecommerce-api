/* eslint-disable @typescript-eslint/no-empty-object-type */
import Stripe from 'stripe';
import { OrderRepo } from 'src/DB';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  private readonly stripeService: StripeService;
  private readonly OrderRepo: OrderRepo;

  constructor() {}
  createCheckoutSession = async ({
    line_items,
    discounts,
    metadata,
    customer_email,
  }: {
    line_items: [];
    metadata: {};
    customer_email: string;
    discounts?: Stripe.Checkout.SessionCreateParams.Discount[];
  }) => {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email,
      metadata,
      success_url: 'http://localhost:3000/order/success',
      cancel_url: 'http://localhost:3000/order/cancel',
      line_items,
      discounts,
    });
    return session;
  };
  createCoupon = async ({
    percent_off,
  }: {
    percent_off: number;
    duration: Stripe.Coupon.Duration;
  }) => {
    const coupon = await this.stripe.coupons.create({
      percent_off,
      duration: 'once',
    });
    return coupon;
  };
  createRefundPayment = async ({
    payment_intent,
  }: {
    payment_intent: string;
  }) => {
    const refund = await this.stripe.refunds.create({
      payment_intent,
      reason: 'requested_by_customer',
    });
    return refund;
  };
}
