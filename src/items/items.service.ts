import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateItemDto } from './dto/create-item.dto';
import { Item, ItemDocument } from './schema/item.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<Item>,
  ) {}

  findAll(): Promise<ItemDocument[]> {
    return this.itemModel.find().sort({ section: 1, name: 1 }).exec();
  }

  create(data: CreateItemDto): Promise<ItemDocument> {
    if (typeof data?.name !== 'string' || !data.name.trim()) {
      throw new BadRequestException('name es obligatorio');
    }
    if (typeof data.section !== 'string' || !data.section.trim()) {
      throw new BadRequestException('section es obligatorio');
    }
    if (
      data.price !== undefined &&
      (typeof data.price !== 'number' || data.price < 0)
    ) {
      throw new BadRequestException(
        'price debe ser un numero mayor o igual a 0',
      );
    }
    return this.itemModel.create(data);
  }
}
