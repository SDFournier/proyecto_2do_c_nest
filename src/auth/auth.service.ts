import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    data: RegisterDto,
  ): Promise<{ id: string; name: string; email: string }> {
    this.assertText(data?.name, 'name');
    this.assertText(data?.email, 'email');
    if (!data.email.includes('@')) {
      throw new BadRequestException('email no es valido');
    }
    if (typeof data.password !== 'string' || data.password.length < 8) {
      throw new BadRequestException(
        'password debe tener al menos 8 caracteres',
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      name: data.name,
      email: data.email,
      passwordHash,
    });

    return { id: user.id, name: user.name, email: user.email };
  }

  async login(data: LoginDto): Promise<{ accessToken: string }> {
    this.assertText(data?.email, 'email');
    this.assertText(data?.password, 'password');

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

  private assertText(value: unknown, field: string): void {
    if (typeof value !== 'string' || !value.trim()) {
      throw new BadRequestException(`${field} es obligatorio`);
    }
  }
}
