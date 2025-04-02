import { PickType } from '@nestjs/swagger';
import { User } from 'src/system/user/entity/user.entity';

export class SigninBodyDto extends PickType(User, ['username', 'password']) {}
