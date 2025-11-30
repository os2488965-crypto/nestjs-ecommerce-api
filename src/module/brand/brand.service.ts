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
import { CreateBrandDto, QueryDto, UpdateBrandDto } from './brand.dto';
import type { HUserDocument, User } from 'src/DB';
import { BrandRepo } from '../../DB/repositories';
import { Document, Types } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { S3Service } from '../../common/service/s3.service';

@Injectable()
export class BrandService {
  S3Service: any;
  constructor(
    private readonly brandRepo: BrandRepo,
    @inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async createBrand(
    brandDto: CreateBrandDto,
    user: HUserDocument,
    file: Express.Multer.File,
  ) {
    const { name, slogan } = brandDto;
    const brandExist = await this.brandRepo.findOne({ filter: { name } });
    if (brandExist) {
      throw new ConflictException('Brand Name already exist');
    }

    const url = await this.S3Service.uploadFile({
      path: 'brands',
      file,
    });

    const brand = await this.brandRepo.create({
      name,
      slogan,
      image: url,
      createdBy: user._id,
    });
    if (!brand) {
      throw new InternalServerErrorException('falied to create brand');
    }

    return brand;
  }
  async updateBrand(
    id: Types.ObjectId,
    brandDto: UpdateBrandDto,
    user: HUserDocument,
  ) {
    const { name, slogan } = brandDto;
    const brand = await this.brandRepo.findOne({
      filter: { _id: id, createdBy: user._id },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    if (
      name &&
      (await this.brandRepo.findOne({ filter: { name, createdBy: user._id } }))
    ) {
      throw new ConflictException('Brand Name already exist');
    }

    const updatedBrand = await this.brandRepo.findOneAndUpdate(
      { _id: id, createdBy: user._id },
      { name, slogan },
    );
    return updatedBrand;
  }
  async updateBrandImage(
    id: Types.ObjectId,
    file: Express.Multer.File,
    user: HUserDocument,
  ) {
    const brand = await this.brandRepo.findOne({
      filter: { _id: id, createdBy: user._id },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    const url = await this.S3Service.uploadFile({
      path: 'brands',
      file,
    });

    const updatedBrand = await this.brandRepo.findOneAndUpdate(
      { _id: id },
      { image: url },
    );

    if (!updatedBrand) {
      await this.S3Service.deleteFile({
        path: url,
      });
      throw new InternalServerErrorException('Failed to update brand image');
    }

    await this.S3Service.deleteFile({
      path: brand.image,
    });
    return updatedBrand;
  }
  async freezeBrand(id: Types.ObjectId, user: HUserDocument) {
    const brand = await this.brandRepo.findOneAndUpdate(
      { _id: id, deletedAt: { $exists: false } },
      { deletedAt: new Date(), updatedBy: user._id },
    );

    if (!brand) {
      throw new NotFoundException('Brand not found or already deleted');
    }

    return brand;
  }
  async deleteBrand(id: Types.ObjectId) {
    const brand = await this.brandRepo.findOneAndDelete({
      _id: id,
      deletedAt: { $exists: true },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found or already deleted');
    }

    await this.S3Service.deleteFile({
      path: brand.image,
    });

    return brand;
  }
  async getAllBrands(query: QueryDto) {
    const { page = 1, limit = 10 } = query;
    const {
      docs: result,
      currentPage,
      totalDocs: countDoc,
      totalPages: totalPage,
    } = await this.brandRepo.paginate({
      filter: {},
      query: { page, limit },
    });

    return { currentPage, countDoc, totalPage, result };
  }
  //   let brands = await this.cacheManager.get("brands");
  // if (!brands) {
  //     console.log("ay 7aga");
  //     brands = await this.brandRepo.find({ filter: {} });
  //     await this.cacheManager.set("brands", brands, 10000);
  // }
  // return brands;
}
function inject(
  CACHE_MANAGER: string,
): (
  target: typeof BrandService,
  propertyKey: undefined,
  parameterIndex: 1,
) => void {
  throw new Error('Function not implemented.');
}
