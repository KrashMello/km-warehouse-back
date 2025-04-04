import { HttpException, HttpStatus } from '@nestjs/common'
interface opt {
  data: string | Record<string, any>
  type?: 'WARNING' | 'SUCCESS' | 'DANGER' | 'INFO'
}

export default (opt: {
  data: string | Record<string, any>
  type?: 'WARNING' | 'SUCCESS' | 'DANGER' | 'INFO'
  status: HttpStatus
}) => {
  const { status, data, type } = opt
  return response[status]({ data, type })
}

const response = {
  404: (opt: opt) => {
    const { data, type } = opt
    const status = HttpStatus.NOT_FOUND
    throw new HttpException({ type: type ?? 'WARNING', data, status }, status)
  },
  400: (opt: opt) => {
    const { data, type } = opt
    const status = HttpStatus.BAD_REQUEST
    throw new HttpException({ type: type ?? 'WARNING', data, status }, status)
  },
  201: (opt: opt) => {
    const { data, type } = opt
    const status = HttpStatus.CREATED
    throw new HttpException({ type: type ?? 'SUCCESS', data, status }, status)
  },
  200: (opt: opt) => {
    const { data, type } = opt
    const status = HttpStatus.OK
    throw new HttpException({ type: type ?? 'SUCCESS', data, status }, status)
  },
  401: (opt: opt) => {
    const { data, type } = opt
    const status = HttpStatus.UNAUTHORIZED
    throw new HttpException({ type: type ?? 'WARNING', data, status }, status)
  },
}
