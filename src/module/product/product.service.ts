/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-const */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateproductDto, updateProductDto } from './product.dto';
import { Brand, BrandRepo } from 'src/DB';
import { productRepo } from '../../DB/repositories';
import { categoryRepo } from '../../DB/repositories/category.repo';
import type { HUserDocument, UserRepo } from 'src/DB';
import { Types } from 'mongoose';

@Injectable()
export class productService {
  S3Service: any;
  constructor(
    private readonly ProductRepo: productRepo,
    private readonly brandRepo: BrandRepo,
    private readonly categoryRepo: categoryRepo,
    private readonly userRepo: UserRepo,

    // private readonly S3Service: S3Service,
  ) {}
  //========================================Create product===========================================
  async createProduct(
    ProductDto: CreateproductDto,
    user: HUserDocument,
    files: {
      mainImage: Express.Multer.File[];
      subImages: Express.Multer.File[];
    },
  ) {
    let {
      name,
      description,
      price,
      discount,
      quantity,
      stock,
      brand,
      category,
    } = ProductDto;

    const brandExist = await this.brandRepo.findOne({ filter: { _id: brand } });
    if (!brandExist) throw new NotFoundException('Brand not found');

    const BrandExist = await this.brandRepo.findOne({
      filter: { _id: Brand },
    });
    if (!BrandExist) throw new NotFoundException('Brand not found');

    if (stock > quantity) {
      throw new BadRequestException(
        'stock must be less than or equal quantity',
      );
    }

    price = price - price * ((discount || 0) / 100);

    const filePath = files.mainImage[0];
    const filePaths = files.subImages;

    const mainImage = await this.S3Service.uploadFile({
      file: filePath,
      path: `Categories/${BrandExist._id}/products/mainImage`,
    });

    const subImages = await this.S3Service.uploadFiles({
      files: filePaths,
      path: `Categories/${BrandExist._id}/products/subImages`,
    });
    const Product = await this.ProductRepo.create({
      name,
      description,
      price,
      discount,
      quantity,
      stock,
      brand,
      category,
      mainImage,
      subImages,
      createdBy: user._id,
    });

    if (!Product) {
      await this.S3Service.deleteFile({
        path: mainImage,
      });
      await this.S3Service.deleteFiles({
        urls: subImages,
      });
      throw new InternalServerErrorException('Failed to create Product');
    }

    return Product;
  }
  //========================================Update product===========================================
  // ==================== update Product ====================

  async updateProduct(
    body: updateProductDto,
    user: HUserDocument,
    id: Types.ObjectId,
  ) {
    let {
      name,
      description,
      category,
      brand,
      price,
      discount,
      stock,
      quantity,
    } = body;

    let product = await this.ProductRepo.findOne({
      filter: { _id: id },
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (category) {
      const categoryExist = await this.categoryRepo.findOne({
        filter: { _id: category },
      });
      if (!categoryExist) {
        throw new BadRequestException('Category not found');
      }
    }

    if (brand) {
      const brandExist = await this.brandRepo.findOne({
        filter: { _id: brand },
      });
      if (!brandExist) {
        throw new BadRequestException('Brand not found');
      }
    }

    if (price && discount) {
      price = price - price * (discount / 100);
    } else if (price) {
      price = price - price * (product.discount / 100);
    } else if (discount) {
      price = product.price - product.price * (discount / 100);
    }

    if (stock) {
      if (stock > product.quantity) {
        throw new BadRequestException('Stock should be less than quantity');
      }
    }
    product = await this.ProductRepo.findOneAndUpdate({
      filter: { _id: id },
      update: {
        ...body,
        price,
        discount,
        stock,
        quantity,
      },
    });

    return { product };
  }
  async addToWishList(id: Types.ObjectId, user: HUserDocument) {
    const product = await this._productRepository.findOne({
      filter: { _id: id },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    let userExist = await this.userRepo.findOneAndUpdate(
      { _id: user._id, wishList: { $in: id } },
      { $pull: { wishList: id } },
    );

    if (!userExist) {
      userExist = await this.userRepo.findOneAndUpdate(
        { _id: user._id },
        { $push: { wishList: id } },
      );
    }

    return userExist;
  }
}
