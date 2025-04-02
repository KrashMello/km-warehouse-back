import { OmitType } from '@nestjs/swagger';
import { FindOneDto } from './findOne.dto';

export class FindUserCredentialsDto extends OmitType(FindOneDto, ['id']) {}
