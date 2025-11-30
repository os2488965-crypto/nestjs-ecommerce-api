import { BadRequestException, Injectable } from '@nestjs/common';
import { BrandRepo, HUserDocument } from 'src/DB';
import { CartRepo, productRepo } from '../../DB/repositories';
import { CreateCartDto, updateQuantityDto } from './cart.dto';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    private readonly brandRepo: BrandRepo,
    private readonly _ProductRepository: productRepo,
    private readonly _CartRepository: CartRepo,
  ) {}

  // ==================== create Cart ====================

  async createCart(body: CreateCartDto, user: HUserDocument) {
    const { productId, quantity } = body;

    const product = await this._ProductRepository.findOne({
      filter: {
        _id: productId,
        stock: { $gte: quantity },
      },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const cart = await this._CartRepository.findOne({
      filter: { createdBy: user._id },
    });

    if (!cart) {
      const newCart = await this._CartRepository.create({
        createdBy: user._id,
        products: [
          {
            productId,
            quantity,
            finalPrice: product.price,
          },
        ],
      });
      return newCart;
    }
    const productCart = cart.products.find(
      (product) => product.productId.toString() === productId.toString(),
    );

    if (productCart) {
      throw new BadRequestException('Product already in cart');
    }

    cart.products.push({
      productId,
      quantity,
      finalPrice: product.price,
    });

    await cart.save();
    return cart;
  }

  // ==================== removeProductFrom Cart ====================

  async removeProductFromCart(id: Types.ObjectId, user: HUserDocument) {
    const product = await this._ProductRepository.findOne({
      filter: { _id: id },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const cart = await this._CartRepository.findOne({
      filter: {
        createdBy: user._id,
        // "products.productId": id
      },
    });

    if (!cart) {
      throw new BadRequestException('Cart not found');
    }

    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== id.toString(),
    );

    await cart.save();
    return cart;
  }
  // ==================== updateQuantityFrom Cart ====================

  async updateProductQuantityFromCart(
    id: Types.ObjectId,
    user: HUserDocument,
    body: updateQuantityDto,
  ) {
    const { quantity } = body;
    const cart = await this._CartRepository.findOne({
      filter: {
        createdBy: user._id,
        // products: { $elemMatch: { productId: id } }
        'products.productId': id,
      },
    });

    if (!cart) {
      throw new BadRequestException('Cart not found');
    }

    cart.products.find((product) => {
      if (product.productId.toString() === id.toString()) {
        product.quantity = quantity;
        return product;
      }
    });

    await cart.save();
    return cart;
  }
}
