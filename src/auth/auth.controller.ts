import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserDocument } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from './auth.guard';
import { AccessToken, AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import type { AuthenticatedRequest } from './jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() data: RegisterUserDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginUserDto): Promise<AccessToken> {
    return this.authService.login(data);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(
    @Req() request: AuthenticatedRequest,
  ): Promise<UserDocument> {
    return this.usersService.findOne(request.user.sub);
  }
}
