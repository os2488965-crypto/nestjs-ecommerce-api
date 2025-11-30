/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBrandDto, idDto, QueryDto, UpdateBrandDto } from './brand.dto';
import { BrandService } from './brand.service';
import * as DB from 'src/DB';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/common/decorators';
import { RoleEnum, TokenTypeEnum } from 'src/common/enums';
import { fileValidation, multerCloud } from 'src/common/utils/multer';
import type { HUserDocument } from 'src/DB';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Auth({
    role: [RoleEnum.ADMIN],
    typeToken: TokenTypeEnum.access,
  })
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      multerCloud({ fileType: fileValidation.image }),
    ),
  )
  @Post()
  async createBrand(
    @Body() brandDto: CreateBrandDto,
    User: DB.HUserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const brand = this.brandService.createBrand(brandDto, User, file);
    return { message: 'done', brand };
  }
  @Auth({
    role: [RoleEnum.ADMIN],
    typeToken: TokenTypeEnum.access,
  })
  @Patch('/update/:id')
  async updateBrand(
    @Param('id') params: idDto,
    @Body() brandDto: UpdateBrandDto,
    user: HUserDocument,
    // @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const brand = this.brandService.updateBrand(params.id, brandDto, user);
    return { message: 'done', brand };
  }
  @Auth({
    role: [RoleEnum.ADMIN],
    typeToken: TokenTypeEnum.access,
  })
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      multerCloud({ fileType: fileValidation.image }),
    ),
  )
  @Patch('/updateImage/:id')
  async updateBrandImage(
    @Param() params: idDto,
    user: HUserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const brand = await this.brandService.updateBrandImage(
      params.id,
      file,
      user,
    );
    return { message: 'done', brand };
  }
  @Auth({
    role: [RoleEnum.ADMIN],
    typeToken: TokenTypeEnum.access,
  })
  @Patch('/freeze/:id')
  async freezeBrand(@Param() params: idDto, user: HUserDocument) {
    const brand = await this.brandService.freezeBrand(params.id, user);
    return { message: 'done', brand };
  }
  @Auth({
    role: [RoleEnum.ADMIN],
    typeToken: TokenTypeEnum.access,
  })
  @Delete(':id')
  async deleteBrand(@Param() params: idDto) {
    const brand = await this.brandService.deleteBrand(params.id);
    return { message: 'done', brand };
  }
  @Get()
  async getAllBrands(@Query() query: QueryDto) {
    const { currentPage, countDoc, totalPage, result } =
      await this.brandService.getAllBrands(query);
    return { message: 'done', currentPage, countDoc, totalPage, result };
  }
}
