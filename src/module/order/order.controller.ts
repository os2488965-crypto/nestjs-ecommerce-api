/* eslint-disable @typescript-eslint/require-await */
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/common/decorators';
import { RoleEnum, TokenTypeEnum } from 'src/common/enums';
import { User } from 'src/DB';
import { CreateOrderDto, paramDto } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly OrderService: OrderService) {}
  @Auth({
    role: [RoleEnum.ADMIN, RoleEnum.USER],
    typeToken: TokenTypeEnum.access,
  })
  @Post()
  async createOrder(@Body() body: CreateOrderDto, user: User) {
    return this.OrderService.createOrder(body, user);
  }
  @Auth({
    role: [RoleEnum.ADMIN, RoleEnum.USER],
    typeToken: TokenTypeEnum.access,
  })
  @Post('/stripe/:id')
  async paymentWithStripe(@Param() params: paramDto, user: User) {
    return this.OrderService.paymentWithStripe(params.id, user);
  }
  @Post('/webhook')
  async webhook(@Body() body: any) {
    await this.OrderService.webhook(body);
  }
  @Auth({
    role: [RoleEnum.ADMIN],
    typeToken: TokenTypeEnum.access,
  })
  @Patch('/:id')
  async refundedOrder(@Param() params: paramDto, user: User) {
    return this.OrderService.refundedOrder(params.id, user);
  }
}
