import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindUsersQueryDto {
  @IsOptional()
  @IsIn(['true', 'false'])
  active?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
