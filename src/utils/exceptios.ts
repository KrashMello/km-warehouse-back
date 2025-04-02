import { HttpException, HttpStatus } from '@nestjs/common'
interface opt {
  data: string | Record<string, any>
  type?: 'WARNING' | 'SUCCESS' | 'DANGER' | 'INFO'
}

export const NotFound = (opt: opt) => {
  const { data, type } = opt
  const status = HttpStatus.NOT_FOUND
  throw new HttpException({ type: type ?? 'WARNING', data, status }, status)
}

export const BadRequest = (opt: opt) => {
  const { data, type } = opt
  const status = HttpStatus.BAD_REQUEST
  throw new HttpException({ type: type ?? 'WARNING', data, status }, status)
}

export const Create = (opt: opt) => {
  const { data, type } = opt
  const status = HttpStatus.CREATED
  throw new HttpException({ type: type ?? 'SUCCESS', data, status }, status)
}

export const Ok = (opt: opt) => {
  const { data, type } = opt
  const status = HttpStatus.OK
  throw new HttpException({ type: type ?? 'SUCCESS', data, status }, status)
}

export const Unauthorized = (opt: opt) => {
  const { data, type } = opt
  const status = HttpStatus.UNAUTHORIZED
  throw new HttpException({ type: type ?? 'WARNING', data, status }, status)
}
