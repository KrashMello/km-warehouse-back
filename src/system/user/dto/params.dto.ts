import { OmitType } from '@nestjs/swagger';
import { FindOneDto } from './findOne.dto';

export class UserParamDto extends OmitType(FindOneDto, ['username', 'email']) {}
