import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { UserDocument } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_BYTES = 72;

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(data: RegisterUserDto): Promise<UserDocument> {
    this.assertRegistrationIsValid(data);

    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.usersService.create({
      name: data.name,
      email: data.email,
      age: data.age,
      passwordHash,
      active: true,
    });
  }

  private assertRegistrationIsValid(data: RegisterUserDto): void {
    if (typeof data !== 'object' || data === null) {
      throw new BadRequestException('el body es obligatorio');
    }
    if (typeof data.name !== 'string' || !data.name.trim()) {
      throw new BadRequestException('name es obligatorio');
    }
    if (typeof data.email !== 'string' || !data.email.includes('@')) {
      throw new BadRequestException('email debe ser un email válido');
    }
    if (!Number.isInteger(data.age) || data.age < 13) {
      throw new BadRequestException(
        'age debe ser un entero mayor o igual a 13',
      );
    }
    if (
      typeof data.password !== 'string' ||
      data.password.length < PASSWORD_MIN_LENGTH
    ) {
      throw new BadRequestException(
        `password debe ser un texto de al menos ${PASSWORD_MIN_LENGTH} caracteres`,
      );
    }
    if (Buffer.byteLength(data.password, 'utf8') > PASSWORD_MAX_BYTES) {
      throw new BadRequestException(
        `password no puede superar ${PASSWORD_MAX_BYTES} bytes`,
      );
    }
  }
}
