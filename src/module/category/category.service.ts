/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatecategoryDto, QueryDto, UpdatecategoryDto } from './category.dto';
import type { HUserDocument, User } from 'src/DB';
import { Document, Types } from 'mongoose';
// import { S3Service } from '../../common/service/s3.service';
import { categoryRepo } from '../../DB/repositories/category.repo';
import { BrandRepo } from '../../DB/repositories/brand.repo';
@Injectable()
export class categoryService {
  S3Service: any;
  constructor(
    private readonly categoryRepo: categoryRepo,
    private readonly BrandRpo: BrandRepo,
  ) {}
  async createcategory(
    categoryDto: CreatecategoryDto,
    user: HUserDocument,
    file: Express.Multer.File,
  ) {
    const { name, slogan, brands } = categoryDto;
    const categoryExist = await this.categoryRepo.findOne({ filter: { name } });
    if (categoryExist) {
      throw new ConflictException('category Name already exist');
    }
    if (
      brands &&
      (await this.BrandRpo.find({ filter: { _id: { $in: brands } } })).length !=
        brands.length
    ) {
      throw new NotFoundException('Brands not found');
    }

    const url = await this.S3Service.uploadFile({
      path: 'categorys',
      file,
    });

    const category = await this.categoryRepo.create({
      name,
      slogan,
      image: url,
      createdBy: user._id,
      brands,
    });
    if (!category) {
      throw new InternalServerErrorException('falied to create category');
    }

    return category;
  }
  async updatecategory(
    id: Types.ObjectId,
    categoryDto: UpdatecategoryDto,
    user: HUserDocument,
  ) {
    const { name, slogan, brands } = categoryDto;
    const category = await this.categoryRepo.findOne({
      filter: { _id: id, createdBy: user._id },
    });
    if (!category) {
      throw new NotFoundException('category not found');
    }
    if (
      brands &&
      (await this.BrandRpo.find({ filter: { _id: { $in: brands } } })).length !=
        brands.length
    ) {
      throw new NotFoundException('Brands not found');
    }

    if (
      name &&
      (await this.categoryRepo.findOne({
        filter: { name, createdBy: user._id },
      }))
    ) {
      throw new ConflictException('category Name already exist');
    }

    const updatedcategory = await this.categoryRepo.findOneAndUpdate(
      { _id: id, createdBy: user._id },
      { name, slogan, brands },
    );
    return updatedcategory;
  }
  async updatecategoryImage(
    id: Types.ObjectId,
    file: Express.Multer.File,
    user: HUserDocument,
  ) {
    const category = await this.categoryRepo.findOne({
      filter: { _id: id, createdBy: user._id },
    });
    if (!category) {
      throw new NotFoundException('category not found');
    }
    const url = await this.S3Service.uploadFile({
      path: 'categorys',
      file,
    });

    const updatedcategory = await this.categoryRepo.findOneAndUpdate(
      { _id: id },
      { image: url },
    );

    if (!updatedcategory) {
      await this.S3Service.deleteFile({
        path: url,
      });
      throw new InternalServerErrorException('Failed to update category image');
    }

    await this.S3Service.deleteFile({
      path: category.image,
    });
    return updatedcategory;
  }
  async freezecategory(id: Types.ObjectId, user: HUserDocument) {
    const category = await this.categoryRepo.findOneAndUpdate(
      { _id: id, deletedAt: { $exists: false } },
      { deletedAt: new Date(), updatedBy: user._id },
    );

    if (!category) {
      throw new NotFoundException('category not found or already deleted');
    }

    return category;
  }
  async deletecategory(id: Types.ObjectId) {
    const category = await this.categoryRepo.findOneAndDelete({
      _id: id,
      deletedAt: { $exists: true },
    });

    if (!category) {
      throw new NotFoundException('category not found or already deleted');
    }

    await this.S3Service.deleteFile({
      path: category.image,
    });

    return category;
  }
  async getAllcategorys(query: QueryDto) {
    const { page = 1, limit = 10 } = query;
    const {
      docs: result,
      currentPage,
      totalDocs: countDoc,
      totalPages: totalPage,
    } = await this.categoryRepo.paginate({
      filter: {},
      query: { page, limit },
    });

    return { currentPage, countDoc, totalPage, result };
  }
}
