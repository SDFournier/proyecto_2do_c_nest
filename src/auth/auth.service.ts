import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { UserDocument } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './jwt-payload.interface';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_BYTES = 72;

export interface AccessToken {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

  async login(data: LoginUserDto): Promise<AccessToken> {
    this.assertLoginIsValid(data);

    const user = await this.usersService.findByEmail(data.email);
    const passwordMatches = user
      ? await bcrypt.compare(data.password, user.passwordHash)
      : false;

    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Email o password incorrectos.');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  private assertLoginIsValid(data: LoginUserDto): void {
    if (typeof data !== 'object' || data === null) {
      throw new BadRequestException('el body es obligatorio');
    }
    if (typeof data.email !== 'string' || !data.email.trim()) {
      throw new BadRequestException('email es obligatorio');
    }
    if (typeof data.password !== 'string' || !data.password) {
      throw new BadRequestException('password es obligatorio');
    }
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
