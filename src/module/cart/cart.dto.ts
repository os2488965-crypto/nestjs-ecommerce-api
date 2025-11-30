import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class updateQuantityDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateCartDto extends updateQuantityDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: Types.ObjectId;
}

export class paramDto {
  @IsMongoId()
  @IsNotEmpty()
  id: Types.ObjectId;
}
