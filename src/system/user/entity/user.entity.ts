import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsDateString,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
} from 'class-validator';
export class User {
  @ApiProperty({
    name: 'id',
    example: 1,
  })
  id: number;
  @ApiProperty({
    name: 'username',
    example: 'test',
  })
  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;
  @ApiProperty({
    name: 'email',
    example: 'test@test.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    name: 'password',
    example: '1234',
  })
  @IsNotEmpty()
  @IsAlphanumeric()
  password: string;
  @ApiProperty({
    name: 'status_id',
    example: 1,
  })
  status_id: number;
  @ApiProperty({
    name: 'firstname',
    example: 'jhon',
  })
  @IsNotEmpty()
  @IsAlphanumeric()
  firstname: string;
  @ApiProperty({
    name: 'lastname',
    example: 'white',
  })
  @IsNotEmpty()
  @IsAlphanumeric()
  lastname: string;
  @ApiProperty({
    name: 'birthdate',
    example: '01-01-1999',
  })
  @IsNotEmpty()
  @IsDateString()
  birthdate: string;
  @ApiProperty({
    name: 'phone_number',
    example: '555-555-55-55',
  })
  @IsNotEmpty()
  @IsAlphanumeric()
  phone_number: string;
}

export class FindUser extends OmitType(User, ['password']) {}
