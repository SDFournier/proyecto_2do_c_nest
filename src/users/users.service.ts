import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(): Promise<User[]> {
    await sleep(250);
    return this.users;
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
    await sleep(250);
    const user: User = { id: this.users.length + 1, ...data };
    this.users.push(user);
    return user;
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
