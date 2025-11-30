/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CartRepo, CouponRepo, OrderRepo, productRepo } from 'src/DB';
import { CreateOrderDto } from './order.dto';
import {
  OrderStatusEnum,
  PaymentMethodEnum,
} from 'src/common/enums/order.enum';
import { StripeService } from 'src/common/service/stripe.service';
import { Types } from 'mongoose';
import { Coupon } from '../../DB/models/coupon.model';
import type { userDocument } from 'src/DB/models/user.model';

@Injectable()
export class OrderService {
  constructor(
    private readonly OrderRepo: OrderRepo,
    private readonly cartRepo: CartRepo,
    private readonly productRepo: productRepo,
    private readonly couponRepo: CouponRepo,
    private readonly stripeService: StripeService,
  ) {}
  async createOrder(body: CreateOrderDto, user: userDocument) {
    const { address, phone, paymentMethod, couponCode } = body;

    if (couponCode) {
      const coupon = await this.couponRepo.findOne({
        filter: { code: couponCode, usedBy: { $ne: [user?._id] } },
      });
      if (!coupon) {
        throw new BadRequestException('Coupon not found');
      }
    }

    const cart = await this.cartRepo.findOne({
      filter: { createdBy: user._id },
    });
    if (!cart || !cart.products.length) {
      throw new BadRequestException('Cart not found');
    }

    for (const product of cart.products) {
      const productData = await this.productRepo.findOne({
        filter: {
          _id: product.productId,
          stock: { $gte: product.quantity },
        },
      });
      if (!productData) {
        throw new BadRequestException('Product not found');
      }
    }
    const order = await this.OrderRepo.create({
      userId: user._id,
      cart: cart._id,
      coupon: couponCode ? couponCode : undefined,
      totalPrice: couponCode
        ? cart.subTotal - cart.subTotal * (Coupon.amount / 100)
        : cart.subTotal,
      address,
      phone,
      paymentMethod,
      status:
        paymentMethod === PaymentMethodEnum.CASH
          ? OrderStatusEnum.PLACED
          : OrderStatusEnum.PENDING,
    });
    for (const product of cart.products) {
      await this.productRepo.findOneAndUpdate(
        { _id: product.productId },
        { $inc: { stock: -product.quantity } },
      );
    }

    if (Coupon) {
      await this.couponRepo.findOneAndUpdate(
        { _id: Coupon._id },
        { $push: { usedBy: user._id } },
      );

      if (paymentMethod === PaymentMethodEnum.CASH) {
        await this.cartRepo.findOneAndUpdate(
          { _id: cart._id },
          { $set: { products: [] } },
        );
      }
    }

    return order;
  }
  async paymentWithStripe(id: Types.ObjectId, user: userDocument) {
    const order = await this.OrderRepo.findOne({
      filter: { _id: id, status: OrderStatusEnum.PENDING },
      options: {
        populate: [
          {
            path: 'cart',
            populate: [
              {
                path: 'products.productId',
              },
            ],
          },
          {
            psath: 'coupon',
          },
        ],
      },
    });

    if (!order) {
      throw new BadGatewayException('Order not found');
    }

    let coupon: any;
    if (order.coupon) {
      coupon = await this.stripeService.createCoupon({
        percent_off: (order.coupon as any).amount,
        duration: 'once',
      });
    }
    console.log(coupon);
    const { url } = await this.stripeService.createCheckoutSession({
      customer_email: user.email,
      metadata: {
        orderId: order._id.toString(),
      },
      line_items: order.cart['products'].map((product: any) => {
        return {
          price_data: {
            currency: 'egp',
            product_data: {
              name: product.productId.name,
            },
            unit_amount: product.finalPrice * 100,
          },
          quantity: product.quantity,
        };
      }),
      discounts: Coupon ? [{ coupon: Coupon.id }] : [],
    });

    return { url };
  }
  async webhook(body: any) {
    const orderId = body.data.object.metadata.orderId;
    const order = await this.OrderRepo.findOneAndUpdate({
      filter: { _id: orderId },
      update: {
        status: OrderStatusEnum.PAID,
        orderChanges: {
          paidAt: new Date(),
        },
        paymentIntent: body.data.object.payment_intent,
      },
    });
    return order;
  }
  async refundedOrder(id: Types.ObjectId, user: userDocument) {
    const order = await this.OrderRepo.findOneAndUpdate({
      filter: {
        _id: id,
        status: { $in: [OrderStatusEnum.PENDING, OrderStatusEnum.PLACED] },
      },
      update: {
        status: OrderStatusEnum.CANCELED,
        orderChanges: {
          canceledAt: new Date(),
          canceledBy: user._id,
        },
      },
    });

    if (!order) {
      throw new BadGatewayException('Order not found');
    }

    if (order.paymentMethod === PaymentMethodEnum.CARD) {
      await this.stripeService.createRefundPayment({
        payment_intent: order.paymentIntent,
      });
      await this.OrderRepo.findOneAndUpdate({
        filter: { _id: id },
        update: {
          status: OrderStatusEnum.REFUNDED,
          orderChanges: {
            refundAt: new Date(),
            refundedBy: user._id,
          },
        },
      });
    }

    return order;
  }
}
