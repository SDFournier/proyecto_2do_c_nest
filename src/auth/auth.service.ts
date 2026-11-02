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
    this.assertPasswordFitsBcrypt(data.password);

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

  private assertPasswordFitsBcrypt(password: string): void {
    if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
      throw new BadRequestException(
        `password no puede superar ${PASSWORD_MAX_BYTES} bytes`,
      );
    }
  }
}
