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
import {
  CreatecategoryDto,
  idDto,
  QueryDto,
  UpdatecategoryDto,
} from './category.dto';
import { categoryService } from './category.service';
import * as DB from 'src/DB';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/common/decorators';
import { RoleEnum, TokenTypeEnum } from 'src/common/enums';
import { fileValidation, multerCloud } from 'src/common/utils/multer';
import type { HUserDocument } from 'src/DB';

@Controller('categories')
export class categoryController {
  constructor(private readonly categoryService: categoryService) {}

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
  async createcategory(
    @Body() categoryDto: CreatecategoryDto,
    User: DB.HUserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const category = this.categoryService.createcategory(
      categoryDto,
      User,
      file,
    );
    return { message: 'done', category };
  }
  @Auth({
    role: [RoleEnum.ADMIN],
    typeToken: TokenTypeEnum.access,
  })
  @Patch('/update/:id')
  async updatecategory(
    @Param('id') params: idDto,
    @Body() categoryDto: UpdatecategoryDto,
    user: HUserDocument,
    // @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const category = this.categoryService.updatecategory(
      params.id,
      categoryDto,
      user,
    );
    return { message: 'done', category };
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
  async updatecategoryImage(
    @Param() params: idDto,
    user: HUserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const category = await this.categoryService.updatecategoryImage(
      params.id,
      file,
      user,
    );
    return { message: 'done', category };
  }
  @Auth({
    role: [RoleEnum.ADMIN],
    typeToken: TokenTypeEnum.access,
  })
  @Patch('/freeze/:id')
  async freezecategory(@Param() params: idDto, user: HUserDocument) {
    const category = await this.categoryService.freezecategory(params.id, user);
    return { message: 'done', category };
  }
  @Auth({
    role: [RoleEnum.ADMIN],
    typeToken: TokenTypeEnum.access,
  })
  @Delete(':id')
  async deletecategory(@Param() params: idDto) {
    const category = await this.categoryService.deletecategory(params.id);
    return { message: 'done', category };
  }
  @Get()
  async getAllcategorys(@Query() query: QueryDto) {
    const { currentPage, countDoc, totalPage, result } =
      await this.categoryService.getAllcategorys(query);
    return { message: 'done', currentPage, countDoc, totalPage, result };
  }
}
