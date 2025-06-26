import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsOptional,
  Matches,
} from 'class-validator'
import { ToUpperCase } from 'src/utils/ToUpperCase'

export class Module {
  @ApiProperty({ example: 1, description: 'id del modulo' })
  @IsNumberString()
  id: number
  @ApiProperty({ example: 1, description: 'id del modulo padre' })
  @IsNumber()
  @IsOptional()
  pathern_id?: number
  @ApiProperty({ example: 0, description: 'nivel de arbol del modulo' })
  @Matches(/^[0-2]$/, { message: 'el nivel debe ser un numero entre 0 y 2' })
  tree_level?: number
  @ApiProperty({ example: 0, description: 'posicion del modulo' })
  @IsNumber()
  @IsOptional()
  place?: number
  @ApiProperty({ example: 'modulo', description: 'nombre del modulo' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'el nombre debe contener letras',
  })
  @ToUpperCase()
  name: string
  @ApiProperty({
    example: 'dashboard/system/system',
    description: 'direccion del modulo',
  })
  @Matches(/^[a-zA-Z0-9\/-]+$/, {
    message: 'el nombre debe contener letras y numeros',
  })
  @ToUpperCase()
  @IsOptional()
  src?: string
  @ApiProperty({
    example: 'modulo de sistema',
    description: 'descripcion del modulo',
  })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'el nombre debe contener letras',
  })
  @ToUpperCase()
  description: string
  @ApiProperty({ example: 'true', description: 'estado del modulo' })
  @IsBoolean()
  status: Boolean
}
