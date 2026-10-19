import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(active?: string, name?: string): Promise<UserDocument[]> {
    const filter: { active?: boolean; name?: string } = {};

    if (active !== undefined) {
      filter.active = active === 'true';
    }
    if (name !== undefined) {
      filter.name = name;
    }

    return this.userModel.find(filter).exec();
  }

  async create(data: CreateUserDto): Promise<UserDocument> {
    this.assertNewUserIsValid(data);
    return this.userModel.create(data);
  }

  private assertNewUserIsValid(data: CreateUserDto): void {
    if (!data.name?.trim() || !data.email?.includes('@') || !(data.age >= 18)) {
      throw new BadRequestException(
        'Name, email valido y edad mayor o igual a 18 son obligatorios.',
      );
    }
  }
}
