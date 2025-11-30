import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorators';
import { RoleEnum, TokenTypeEnum } from 'src/common/enums';
import { CreateCartDto, paramDto, updateQuantityDto } from './cart.dto';
import type { HUserDocument } from 'src/DB';
import { CartService } from './cart.service';
@Controller('cart')
export class CartController {
  constructor(private readonly CartService: CartService) {}

  // ==================== create Cart ====================
  @Post()
  @Auth({
    role: [RoleEnum.ADMIN, RoleEnum.USER],
    typeToken: TokenTypeEnum.access,
  })
  async createCart(@Body() body: CreateCartDto, user: HUserDocument) {
    return await this.CartService.createCart(body, user);
  }
  // ==================== removeProductFrom Cart ====================

  @Delete(':id')
  @Auth({
    role: [RoleEnum.ADMIN, RoleEnum.USER],
    typeToken: TokenTypeEnum.access,
  })
  async removeProductFromCart(@Param() param: paramDto, user: HUserDocument) {
    return await this.CartService.removeProductFromCart(param.id, user);
  }
  // ==================== updateProductQuantityFrom Cart ====================

  @Patch(':id')
  @Auth({
    role: [RoleEnum.ADMIN, RoleEnum.USER],
    typeToken: TokenTypeEnum.access,
  })
  async updateProductQuantityFromCart(
    @Param() param: paramDto,
    user: HUserDocument,
    @Body() body: updateQuantityDto,
  ) {
    return await this.CartService.updateProductQuantityFromCart(
      param.id,
      user,
      body,
    );
  }
}
