import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { AtLeastOne } from 'src/common/decorators';

export class CreateproductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  @IsNotEmpty()
  description: string;
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  stock: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  discount: number;

  @IsMongoId()
  @IsNotEmpty()
  brand: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  category: Types.ObjectId;

  // @IsMongoId()
  // @IsNotEmpty()
  // subCategory: Types.ObjectId;
}
@AtLeastOne([
  'name',
  'description',
  'category',
  'brand',
  'price',
  'discount',
  'stock',
  'quantity',
])
export class updateProductDto extends PartialType(CreateproductDto) {}

export class paramDto {
  @IsMongoId()
  @IsNotEmpty()
  id: Types.ObjectId;
}
