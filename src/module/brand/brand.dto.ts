import { Types } from 'mongoose';
import { PartialType } from '@nestjs/mapped-types';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AtLeastOne } from 'src/common/decorators';
import { Type } from 'class-transformer';
import { number } from 'zod';

export class CreateBrandDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @IsNotEmpty()
  slogan: string;
}

export class idDto {
  @IsNotEmpty()
  @IsMongoId()
  id: Types.ObjectId;
}
@AtLeastOne(['name', 'slogan'])
export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
export class QueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => number)
  limit?: number;
}
