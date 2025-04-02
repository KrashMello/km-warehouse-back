import { PartialType, OmitType } from '@nestjs/swagger';
import { UserCreateDto } from './create.dto';

export class UserUpdateDto extends PartialType(
  OmitType(UserCreateDto, ['password', 'username']),
) {}
