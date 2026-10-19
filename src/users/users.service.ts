import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export type User = {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      age: 28,
      active: true,
    },
  ];

  async findAll(active?: string, name?: string): Promise<User[]> {
    await sleep(250);
    let result = this.users;

    if (active !== undefined) {
      const activeBoolean = active === 'true';
      result = result.filter((user) => user.active === activeBoolean);
    }
    if (name !== undefined) {
      result = result.filter((user) => user.name === name);
    }

    return result;
  }

  async findOne(id: number): Promise<User> {
    await sleep(250);
    const user = this.users.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    this.assertNewUserIsValid(data);
    await sleep(250);
    const user: User = { id: this.users.length + 1, ...data };
    this.users.push(user);
    return user;
  }

  private assertNewUserIsValid(data: CreateUserDto): void {
    if (!data.name?.trim() || !data.email?.includes('@') || !(data.age >= 18)) {
      throw new BadRequestException(
        'Name, email valido y edad mayor o igual a 18 son obligatorios.',
      );
    }
  }

  async update(id: number, changes: UpdateUserDto): Promise<User> {
    await sleep(250);
    const user = await this.findOne(id);
    Object.assign(user, changes);
    return user;
  }

  async remove(id: number): Promise<void> {
    await sleep(250);
    const user = await this.findOne(id);
    this.users.splice(this.users.indexOf(user), 1);
  }
}
