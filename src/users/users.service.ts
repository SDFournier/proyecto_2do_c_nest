import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';

export interface NewUserData {
  name: string;
  email: string;
  age: number;
  active: boolean;
  passwordHash: string;
}

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

  async findOne(id: string): Promise<UserDocument> {
    this.assertValidId(id);

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`El usuario con id ${id} no existe.`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.trim().toLowerCase() }).exec();
  }

  async create(data: NewUserData): Promise<UserDocument> {
    try {
      return await this.userModel.create(data);
    } catch (error) {
      throw this.translateDuplicateEmail(error);
    }
  }

  async update(
    id: string,
    changes: UpdateUserDto,
    requesterId: string,
  ): Promise<UserDocument> {
    this.assertIsSameUser(id, requesterId);

    const allowed = ['name', 'email', 'age', 'active'];
    const fields = Object.keys(changes);

    if (fields.length === 0) {
      throw new BadRequestException(
        'No se han proporcionado campos para actualizar.',
      );
    }
    if (fields.some((key) => !allowed.includes(key))) {
      throw new BadRequestException(
        `Los campos permitidos para actualizar son: ${allowed.join(', ')}`,
      );
    }
    if (changes.age !== undefined && changes.age < 13) {
      throw new BadRequestException('La edad debe ser mayor o igual a 13.');
    }

    const user = await this.findOne(id);

    try {
      return await user.set(changes).save();
    } catch (error) {
      throw this.translateDuplicateEmail(error);
    }
  }

  async remove(id: string, requesterId: string): Promise<void> {
    this.assertIsSameUser(id, requesterId);

    await this.findOne(id);
    await this.userModel.deleteOne({ _id: id }).exec();
  }

  private assertIsSameUser(id: string, requesterId: string): void {
    if (id !== requesterId) {
      throw new ForbiddenException(
        'Solo podés modificar o borrar tu propia cuenta.',
      );
    }
  }

  private assertValidId(id: string): void {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`El ${id} no tiene un formato válido.`);
    }
  }

  private translateDuplicateEmail(error: unknown): unknown {
    const isDuplicate = (error as { code?: number } | null)?.code === 11000;
    return isDuplicate
      ? new ConflictException('El email ya está registrado.')
      : error;
  }
}
