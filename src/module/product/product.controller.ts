import {
  Body,
  Controller,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { productService } from './product.service';
import { Auth } from 'src/common/decorators';
import { RoleEnum, TokenTypeEnum } from 'src/common/enums';
import { fileValidation, multerCloud } from 'src/common/utils/multer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateproductDto, paramDto, updateProductDto } from './product.dto';
import type { HUserDocument } from 'src/DB';

@Controller('products')
export class productController {
  constructor(private readonly productService: productService) {}

  @Auth({
    role: [RoleEnum.ADMIN],
    typeToken: TokenTypeEnum.access,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
      ],
      multerCloud({ fileType: fileValidation.image }),
    ),
  )
  @Post()
  async createProduct(
    @Body() ProductDto: CreateproductDto,
    user: HUserDocument,
    @UploadedFiles(ParseFilePipe)
    files: {
      mainImage: Express.Multer.File[];
      subImages: Express.Multer.File[];
    },
  ) {
    const Product = await this.productService.createProduct(
      ProductDto,
      user,
      files,
    );
    return { message: 'done', Product };
  }
  // ==================== update Product ====================

  @Put(':id')
  @Auth({
    role: [RoleEnum.ADMIN],
    typeToken: TokenTypeEnum.access,
  })
  async updateProduct(
    @Param() param: paramDto,
    @Body() body: updateProductDto,
    user: HUserDocument,
  ) {
    const product = await this.productService.updateProduct(
      body,
      user,
      param.id,
    );
    return { product };
  }
  @Post('wishList/:id')
  @Auth({
    role: [RoleEnum.ADMIN, RoleEnum.USER],
    typeToken: TokenTypeEnum.access,
  })
  async addToWishList(@Param() param: paramDto, user: HUserDocument) {
    const userExist = await this.productService.addToWishList(param.id, user);
    return { message: 'done', user: userExist };
  }
}
